/* global $, Gallery */
(function () {
	/**
	 * Stores the gallery configuration
	 *
	 * @param {{features: *}} config
	 * @constructor
	 */
	var Config = function (config) {
		this.galleryFeatures = this.setGalleryFeatures(config);
	};

	Config.prototype = {
		galleryFeatures: [],
		albumPermissions: null,
		albumInfo: null,
		albumSorting: null,
		albumError: false,
		infoLoaded: false,

		/**
		 * Saves the list of features which have been enabled in the app
		 *
		 * @param config
		 *
		 * @returns {Array}
		 */
		setGalleryFeatures: function (config) {
			var features = [];
			if (!$.isEmptyObject(config.features)) {
				for (var i = 0, keys = Object.keys(config.features); i < keys.length; i++) {
					if (config.features[keys[i]] === 'yes') {
						features.push(keys[i]);
					}
				}
			}

			return features;
		},

		/**
		 * Stores the configuration about the current album
		 *
		 * @param albumConfig
		 */
		setAlbumConfig: function (albumConfig) {
			this.albumPermissions = this.setAlbumPermissions(albumConfig);
			this.albumInfo = this.setAlbumInfo(albumConfig);
			this.albumSorting = this.setAlbumSorting(albumConfig);
			this.albumError = albumConfig.error;
		},

		/**
		 * Saves the permissions for the current album
		 *
		 * @param albumConfig
		 *
		 * @returns {{fileid: *, permissions: *}}
		 */
		setAlbumPermissions: function (albumConfig) {
			return {
				fileid: albumConfig.fileid,
				permissions: albumConfig.permissions
			};
		},

		/**
		 * Saves the description and copyright information for the current album
		 *
		 * @param {{path, information, description_link, copyright_link}} albumConfig
		 *
		 * @returns {{}}
		 */
		setAlbumInfo: function (albumConfig) {
			var albumPath = albumConfig.path;
			var albumInfo = albumConfig.information;
			var params = {};
			if (!$.isEmptyObject(albumInfo)) {
				var docPath = albumPath;
				var level = albumInfo.level;
				if (level > 0) {
					if (docPath.indexOf('/') !== -1) {
						var folders = docPath.split('/');
						folders = folders.slice(-0, -level);
						docPath = folders.join('/') + '/';
					} else {
						docPath = '';
					}
				}

				/* jshint camelcase: false */
				params = {
					description: albumInfo.description,
					descriptionLink: albumInfo.description_link,
					copyright: albumInfo.copyright,
					copyrightLink: albumInfo.copyright_link,
					filePath: docPath,
					inherit: albumInfo.inherit,
					level: albumInfo.level
				};
			}

			return params;
		},

		/**
		 * Saves the sorting configuration for the current album
		 *
		 * @param {{sorting}} albumConfig
		 *
		 * @returns {{type: string, order: string, albumOrder: string}}
		 */
		setAlbumSorting: function (albumConfig) {
			var sortType = 'name';
			var sortOrder = 'asc';
			var albumSortOrder = 'asc';
			if (!$.isEmptyObject(albumConfig.sorting)) {
				if (!$.isEmptyObject(albumConfig.sorting.type)) {
					sortType = albumConfig.sorting.type;
				}
				if (!$.isEmptyObject(albumConfig.sorting.order)) {
					sortOrder = albumConfig.sorting.order;
					if (sortType === 'name') {
						albumSortOrder = sortOrder;
					}
				}
			}

			return {
				type: sortType,
				order: sortOrder,
				albumOrder: albumSortOrder
			};
		},

		/**
		 * Updates the sorting order
		 */
		updateAlbumSorting: function (sortType, sortOrder, albumSortOrder) {
			this.albumSorting = {
				type: sortType,
				order: sortOrder,
				albumOrder: albumSortOrder
			};
		}
	};

	Gallery.Config = Config;
})();