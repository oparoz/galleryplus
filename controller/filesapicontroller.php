<?php
/**
 * ownCloud - galleryplus
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Olivier Paroz <owncloud@interfasys.ch>
 *
 * @copyright Olivier Paroz 2014-2015
 */

namespace OCA\GalleryPlus\Controller;

use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\ILogger;

use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http;

use OCA\GalleryPlus\Http\ImageResponse;
use OCA\GalleryPlus\Service\SearchFolderService;
use OCA\GalleryPlus\Service\ConfigService;
use OCA\GalleryPlus\Service\SearchMediaService;
use OCA\GalleryPlus\Service\DownloadService;
use OCA\GalleryPlus\Service\ServiceException;

/**
 * Class FilesApiController
 *
 * @package OCA\GalleryPlus\Controller
 */
class FilesApiController extends ApiController {

	use Files;
	use HttpError;

	/** @var IURLGenerator */
	private $urlGenerator;

	/**
	 * Constructor
	 *
	 * @param string $appName
	 * @param IRequest $request
	 * @param IURLGenerator $urlGenerator
	 * @param SearchFolderService $searchFolderService
	 * @param ConfigService $configService
	 * @param SearchMediaService $searchMediaService
	 * @param DownloadService $downloadService
	 * @param ILogger $logger
	 */
	public function __construct(
		$appName,
		IRequest $request,
		IURLGenerator $urlGenerator,
		SearchFolderService $searchFolderService,
		ConfigService $configService,
		SearchMediaService $searchMediaService,
		DownloadService $downloadService,
		ILogger $logger
	) {
		parent::__construct($appName, $request);

		$this->urlGenerator = $urlGenerator;
		$this->searchFolderService = $searchFolderService;
		$this->configService = $configService;
		$this->searchMediaService = $searchMediaService;
		$this->downloadService = $downloadService;
		$this->logger = $logger;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * @CORS
	 *
	 * Returns a list of all media files available to the authenticated user
	 *
	 * @see FilesController::getList()
	 *
	 * @param string $location a path representing the current album in the app
	 * @param string $features the list of supported features
	 * @param string $etag the last known etag in the client
	 * @param string $mediatypes the list of supported media types
	 *
	 * @return array <string,array<string,string|int>>|Http\JSONResponse
	 */
	public function getList($location, $features, $etag, $mediatypes) {
		$featuresArray = explode(';', $features);
		$mediaTypesArray = explode(';', $mediatypes);
		try {
			return $this->getFiles($location, $featuresArray, $etag, $mediaTypesArray);
		} catch (\Exception $exception) {
			return $this->jsonError($exception);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * @CORS
	 *
	 * Sends the file matching the fileId
	 *
	 * @param int $fileId the ID of the file we want to download
	 * @param string|null $filename
	 *
	 * @return ImageResponse
	 */
	public function download($fileId, $filename = null) {
		try {
			$download = $this->getDownload($fileId, $filename);
		} catch (ServiceException $exception) {
			return $this->htmlError($this->urlGenerator, $this->appName, $exception);
		}

		return new ImageResponse($download);
	}

}
