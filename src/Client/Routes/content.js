'use strict';

// Root reroute
Crisp.Router.route('/', () => {
    Crisp.Router.go('/content/');
});

// Dashboard
Crisp.Router.route('/content/', () => {
    Crisp.View.get('NavbarMain').showTab('/content/');

    UI.setEditorSpaceContent(
        [
            _.h1('Content'),
            _.p('Right click in the Content pane to create new Content.'),
            _.p('Click on a Content node to edit it.'),
            _.button({class: 'widget widget--button'}, 'New Content')
                .click(() => { HashBrown.Views.Navigation.ContentPane.onClickNewContent(); }),
            _.button({class: 'widget widget--button'}, 'Quick tour')
                .click(HashBrown.Helpers.ContentHelper.startTour),
            _.if(resources.content.length < 1,
                _.button({class: 'widget widget--button condensed', title: 'Click here to get some example content'}, 'Get example content')
                    .click(() => {
                        HashBrown.Helpers.RequestHelper.request('post', 'content/example')
                        .then(() => {
                            location.reload();
                        })
                        .catch(UI.errorModal);
                    })
            )
        ],
        'text'
    );
});

// Edit (JSON editor)
Crisp.Router.route('/content/json/:id', () => {
    Crisp.View.get('NavbarMain').highlightItem('/content/', Crisp.Router.params.id);
    
    let contentEditor = new HashBrown.Views.Editors.JSONEditor({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('content/' + Crisp.Router.params.id),
        apiPath: 'content/' + Crisp.Router.params.id
    });

    UI.setEditorSpaceContent(contentEditor.$element);
});

// Edit (redirect to default tab)
Crisp.Router.route('/content/:id', () => {
    let content = HashBrown.Helpers.ContentHelper.getContentByIdSync(Crisp.Router.params.id);
    
    if(content) {
        let contentSchema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(content.schemaId);

        if(contentSchema) {
            location.hash = '/content/' + Crisp.Router.params.id + '/' + (contentSchema.defaultTabId || 'meta');
        
        } else {
            UI.errorModal(new Error('Schema by id "' + content.schemaId + '" not found'), () => { location.hash = '/content/json/' + Crisp.Router.params.id; });

        }
    
    } else {
        UI.errorModal(new Error('Content by id "' + Crisp.Router.params.id + '" not found'));

    }
});

// Edit (with tab specified)
Crisp.Router.route('/content/:id/:tab', () => {
    Crisp.View.get('NavbarMain').highlightItem('/content/', Crisp.Router.params.id);

    let contentEditor = Crisp.View.get('ContentEditor');

    if(!contentEditor || !contentEditor.model || contentEditor.model.id !== Crisp.Router.params.id) {
        contentEditor = new HashBrown.Views.Editors.ContentEditor({
            modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('content/' + Crisp.Router.params.id)
        });
    
        UI.setEditorSpaceContent(contentEditor.$element);
    } else {
        contentEditor.fetch();
    }
});

