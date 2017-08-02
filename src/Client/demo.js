'use strict';

// ----------
// User
// ----------
window.currentUserIsAdmin = () => { return true; }
window.currentUserHasScope = () => { return true; }

HashBrown.Models.User.current = new HashBrown.Models.User({
    id: '93afb0e4cd9e7545c589a084079e340766f94xb1',
    isAdmin: true,
    isCurrent: true,
    username: 'demouser',
    fullName: 'Demo User',
    email: 'demo@user.com',
    scopes: {}
});

// ----------
// Debug socket
// ----------
window.startDebugSocket = () => {}

/**
 * Fake API
 */
class FakeAPI {
    /**
     * Gets the fake API cache
     */
    static getCache(resource, id) {
        let cache = localStorage.getItem('demo') || '{}';

        try {
            cache = JSON.parse(cache);
        } catch(e) {
            cache = {};
        }

        cache[resource] = cache[resource] || FakeAPI.getNativeResource(resource);

        if(!resource) {
            return cache;
        }

        if(!id) {
            return cache[resource];
        }

        for(let i in cache[resource]) {
            if(cache[resource][i].id == id) {
                return cache[resource][i];
            }
        }

        return null;
    }

    /**
     * Sets the fake API
     */
    static setCache(resource, id, data) {
        let cache = FakeAPI.getCache();

        if(!cache[resource] || !Array.isArray(cache[resource])) {
            cache[resource] = FakeAPI.getNativeResource(resource) || [];
        }

        let foundExisting = false;

        for(let i in cache[resource]) {
            if(cache[resource].id == id) {
                cache[resource] = data;
                foundExisting = true;
                break;
            }
        }

        if(!foundExisting) {
            cache[resource].push(data);
        }

        localStorage.setItem('demo', JSON.stringify(cache));
    }

    /**
     * Request
     */
    static request(method, url, data) {
        url = url.replace('/api/demo/live/', '');
        method = method.toUpperCase();

        return new Promise((resolve, reject) => {
            switch(method) {
                case 'GET':
                    return resolve(FakeAPI.get(url));

                case 'POST':
                    return resolve(FakeAPI.post(url, data));
            }

            resolve();
        });
    }

    /**
     * Parses a resource url
     */
    static parseUrl(url) {
        return {
            resource: url.split('/')[0],
            id: url.split('/')[1]
        };
    }

    /**
     * Get
     */
    static get(url) {
        let query = FakeAPI.parseUrl(url);

        return FakeAPI.getCache(query.resource, query.id);
    }

    /**
     * Post
     */
    static post(url, data) {
        let query = FakeAPI.parseUrl(url);

        return FakeAPI.setCache(query.resource, query.id, data);
    }

    /**
     * Gets a native resource
     */
    static getNativeResource(type) {
        switch(type) {
            case 'connections':
                return [
                    {
                        id: '87afb0x4cd9e75666589a084079e340766f94xb1',
                        title: 'My website',
                        url: 'example.com',
                        locked: true
                    }
                ];

            case 'content':
                return [
                    {
                        "id": "a9c44cf7c7bffc1420a43ff7e68e8fbf32261470",
                        "parentId": "",
                        "createdBy": "db14905b261792b6dd1f5a442375fc266aa6e7ca",
                        "updatedBy": "db14905b261792b6dd1f5a442375fc266aa6e7ca",
                        "createDate": "2017-07-30T10:24:22.140Z",
                        "updateDate": "2017-07-30T10:24:22.141Z",
                        "publishOn": null,
                        "unpublishOn": null,
                        "schemaId": "9e522d637efc8fe2320ff7471c815d2c55a3e439",
                        "isPublished": false,
                        "hasPreview": false,
                        "sort": 10000,
                        "properties": {
                            "url": "/my-home-page/",
                                "title": "My Home Page",
                                "text": "<h2>This is a rich text page</h2><p>A simple page for inserting formatted text and media</p>"
                        },
                        "settings": {
                            "publishing": {
                                "connections": []
                            }
                        }
                    }
                ];

            case 'schemas':
                let schemas = {
                    'contentBase': require('Common/Schemas/Content/contentBase.schema'),
                    'page': require('Common/Schemas/Content/page.schema'),
                    'array': require('Common/Schemas/Field/array.schema'),
                    'boolean': require('Common/Schemas/Field/boolean.schema'),
                    'contentReference': require('Common/Schemas/Field/contentReference.schema'),
                    'contentSchemaReference': require('Common/Schemas/Field/contentSchemaReference.schema'),
                    'date': require('Common/Schemas/Field/date.schema'),
                    'dropdown': require('Common/Schemas/Field/dropdown.schema'),
                    'fieldBase': require('Common/Schemas/Field/fieldBase.schema'),
                    'language': require('Common/Schemas/Field/language.schema'),
                    'mediaReference': require('Common/Schemas/Field/mediaReference.schema'),
                    'number': require('Common/Schemas/Field/number.schema'),
                    'resourceReference': require('Common/Schemas/Field/resourceReference.schema'),
                    'richText': require('Common/Schemas/Field/richText.schema'),
                    'string': require('Common/Schemas/Field/string.schema'),
                    'struct': require('Common/Schemas/Field/struct.schema'),
                    'tags': require('Common/Schemas/Field/tags.schema'),
                    'templateReference': require('Common/Schemas/Field/templateReference.schema'),
                    'url': require('Common/Schemas/Field/url.schema'),
                    '9e522d637efc8fe2320ff7471c815d2c55a3e439': {
                        'id': '9e522d637efc8fe2320ff7471c815d2c55a3e439',
                        'name': 'Rich Text Page',
                        'icon': 'file',
                        'parentSchemaId': 'page',
                        'locked': false,
                        'hiddenProperties': [],
                        'defaultTabId': 'content',
                        'tabs': {},
                        'fields': {
                            'properties': {
                                'text': {
                                    'label': 'Text',
                                    'tabId': 'content',
                                    'schemaId': 'richText'
                                }
                            }
                        },
                        'allowedChildSchemas': [],
                        'type': 'content'
                    }
                };
       
                let result = [];

                for(let k in schemas) {
                    schemas[k].id = k;

                    if(k === 'contentBase' || k === 'page' || schemas[k].type == 'content') {
                        schemas[k].type = 'content';
                    } else {
                        schemas[k].type = 'field';
                    }

                    if(schemas[k].locked !== false) {
                        schemas[k].locked = true;
                    }

                    result.push(schemas[k]);
                }

                return result;
        }
    }
}

/**
 * Wraps an API call with a custom path
 *
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 *
 * @returns {Promise} Response
 */
window.customApiCall = FakeAPI.request;

/**
 * Gets a Schema by id
 */
HashBrown.Helpers.SchemaHelper.getSchemaByIdSync = (id) => {
    let object = FakeAPI.get('schemas', id);

    return HashBrown.Helpers.SchemaHelper.getModel(object);
}

HashBrown.Helpers.SchemaHelper.getSchemaById = (id) => {
    return FakeAPI.request('get', 'schemas/' + id)
    .then((object) => {
        return Promise.resolve(HashBrown.Helpers.SchemaHelper.getModel(object));
    });
};

/**
 * Gets a Schema with parent fields
 */
HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields = (id) => {
    // Get the Schema by id
    return HashBrown.Helpers.SchemaHelper.getSchemaById(id)

    // Return object along with any parent objects
    .then((schema) => {
        schema = schema.getObject();

        // If this Schema has a parent, merge fields with it
        if(schema.parentSchemaId) {
            return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(schema.parentSchemaId)
            .then((parentSchema) => {
                parentSchema = parentSchema.getObject();

                let mergedSchema = HashBrown.Helpers.SchemaHelper.mergeSchemas(schema, parentSchema);

                return Promise.resolve(mergedSchema);
            });
        }

        schema = HashBrown.Helpers.SchemaHelper.getModel(schema);

        // If this Schema doesn't have a parent, return this Schema
        return Promise.resolve(schema);
    });
};

/**
 * Fetches view model data
 */
View.prototype.fetch = function fetch() {
    let view = this;

    function getModel() {
        // Get model from URL
        if(!view.model && typeof view.modelUrl === 'string') {
            customApiCall('get', view.modelUrl)
            .then((result) => {
                view.model = result;

                view.init();
            });
        
        // Get model with function
        } else if(!view.model && typeof view.modelFunction === 'function') {
            view.modelFunction(function(data) {
                view.model = data;

                view.init();
            });

        // Just perform the initialisation
        } else {
            view.init();
        }
    }

    // Get the model
    getModel();    
}

/**
 * Reloads a resource
 */
window.reloadResource = function reloadResource(name) {
    let model = null;
    let result = [];

    switch(name) {
        case 'content':
            model = HashBrown.Models.Content;
            result = FakeAPI.get('content');
            break;

        case 'templates':
            model = HashBrown.Models.Template;
            break;

        case 'users':
            model = HashBrown.Models.User;
            break;

        case 'media':
            model = HashBrown.Models.Media;
            break;

        case 'connections':
            model = HashBrown.Models.Connection;
            result = FakeAPI.get('connections');
            break;

        case 'schemas':
            result = FakeAPI.get('schemas');
            break;
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            window.resources[name] = result;

            // If a model is specified, use it to initialise every resource
            if(model) {
                for(let i in window.resources[name]) {
                    window.resources[name][i] = new model(window.resources[name][i]);
                }
            }

            resolve(result);
        }, 100);
    });
};
