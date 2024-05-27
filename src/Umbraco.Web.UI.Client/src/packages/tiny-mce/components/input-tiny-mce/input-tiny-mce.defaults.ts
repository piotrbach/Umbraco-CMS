import { UMB_CONTENT_REQUEST_EVENT_TYPE, type UmbContextRequestEvent } from '@umbraco-cms/backoffice/context-api';
import type { RawEditorOptions } from '@umbraco-cms/backoffice/external/tinymce';

//export const UMB_BLOCK_ENTRY_WEB_COMPONENTS_ABSOLUTE_PATH = '/umbraco/backoffice/packages/block/block-rte/index.js';
export const UMB_BLOCK_ENTRY_WEB_COMPONENTS_ABSOLUTE_PATH = '@umbraco-cms/backoffice/block-rte';

//we put these as extended elements because they get merged on top of the normal allowed elements by tiny mce
//so we don't have to specify all the normal elements again
export const defaultFallbackConfig: RawEditorOptions = {
	plugins: ['anchor', 'charmap', 'table', 'lists', 'advlist', 'autolink', 'directionality', 'searchreplace'],
	valid_elements:
		'+a[id|style|rel|data-id|data-udi|rev|charset|hreflang|dir|lang|tabindex|accesskey|type|name|href|target|title|class|onfocus|onblur|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup],-strong/-b[class|style],-em/-i[class|style],-strike[class|style],-s[class|style],-u[class|style],#p[id|style|dir|class|align],-ol[class|reversed|start|style|type],-ul[class|style],-li[class|style],br[class],img[id|dir|lang|longdesc|usemap|style|class|src|onmouseover|onmouseout|border|alt=|title|hspace|vspace|width|height|align|umbracoorgwidth|umbracoorgheight|onresize|onresizestart|onresizeend|rel|data-id],-sub[style|class],-sup[style|class],-blockquote[dir|style|class],-table[border=0|cellspacing|cellpadding|width|height|class|align|summary|style|dir|id|lang|bgcolor|background|bordercolor],-tr[id|lang|dir|class|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor],tbody[id|class],thead[id|class],tfoot[id|class],#td[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor|scope],-th[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|scope],caption[id|lang|dir|class|style],-div[id|dir|class|align|style],-span[class|align|style],-pre[class|align|style],address[class|align|style],-h1[id|dir|class|align|style],-h2[id|dir|class|align|style],-h3[id|dir|class|align|style],-h4[id|dir|class|align|style],-h5[id|dir|class|align|style],-h6[id|style|dir|class|align|style],hr[class|style],small[class|style],dd[id|class|title|style|dir|lang],dl[id|class|title|style|dir|lang],dt[id|class|title|style|dir|lang],object[class|id|width|height|codebase|*],param[name|value|_value|class],embed[type|width|height|src|class|*],map[name|class],area[shape|coords|href|alt|target|class],bdo[class],button[class],iframe[*],figure,figcaption,cite,video[*],audio[*],picture[*],source[*],canvas[*]',
	invalid_elements: 'font',
	extended_valid_elements:
		'@[id|class|style],umb-rte-block[!data-content-udi],-umb-rte-block-inline[!data-content-udi],-div[id|dir|class|align|style],ins[datetime|cite],-ul[class|style],-li[class|style],-h1[id|dir|class|align|style],-h2[id|dir|class|align|style],-h3[id|dir|class|align|style],-h4[id|dir|class|align|style],-h5[id|dir|class|align|style],-h6[id|style|dir|class|align],span[id|class|style|lang],figure,figcaption',
	toolbar: [
		'styles',
		'bold',
		'italic',
		'alignleft',
		'aligncenter',
		'alignright',
		'bullist',
		'numlist',
		'outdent',
		'indent',
		'link',
		'umbmediapicker',
		'umbembeddialog',
	],

	init_instance_callback: function (editor) {
		// The following code is the context api proxy.
		// It re-dispatches the context api request event to the origin target of this modal, in other words the element that initiated the modal. [NL]
		editor.dom.doc.addEventListener(UMB_CONTENT_REQUEST_EVENT_TYPE, ((event: UmbContextRequestEvent) => {
			if (!editor.iframeElement) return;

			event.stopImmediatePropagation();
			editor.iframeElement.dispatchEvent(event.clone());
		}) as EventListener);

		// Transfer our import-map to the iframe: [NL]
		const importMapTag = document.head.querySelector('script[type="importmap"]');
		if (importMapTag) {
			const importMap = document.createElement('script');
			importMap.type = 'importmap';
			importMap.text = importMapTag.innerHTML;
			editor.dom.doc.head.appendChild(importMap);
		}

		// TODO: Lets use/adapt the router-slot logic so we do not need to add this here [NL]
		// TODO: When transfering this code, make sure that we check for target='_parent' or target='top' if its happening within a iframe. [NL]
		editor.dom.doc.addEventListener('click', (e: MouseEvent) => {
			// If we try to open link in a new tab, then we want to skip skip:
			//if ((isWindows && e.ctrlKey) || (!isWindows && e.metaKey)) return;

			// Find the target by using the composed path to get the element through the shadow boundaries.
			// Notice the difference here compared to RouterSlots implementation [NL]
			const $anchor: HTMLAnchorElement = (('composedPath' in e) as any)
				? (e
						.composedPath()
						.find(($elem) => $elem instanceof HTMLAnchorElement || ($elem as any).tagName === 'A') as HTMLAnchorElement)
				: (e.target as HTMLAnchorElement);

			// Abort if the event is not about the anchor tag
			if ($anchor == null || !($anchor instanceof HTMLAnchorElement || ($anchor as any).tagName === 'A')) {
				return;
			}

			// Get the HREF value from the anchor tag
			const href = $anchor.href;

			// Only handle the anchor tag if the follow holds true:
			// - The HREF is relative to the origin of the current location.
			// - The target is targeting the current frame.
			// - The anchor doesn't have the attribute [data-router-slot]="disabled"
			if (
				!href.startsWith(location.origin) ||
				($anchor.target !== '' && $anchor.target !== '_self') ||
				$anchor.dataset['routerSlot'] === 'disabled'
			) {
				return;
			}

			// Remove the origin from the start of the HREF to get the path
			const path = $anchor.pathname + $anchor.search + $anchor.hash;

			// Prevent the default behavior
			e.preventDefault();

			// Change the history!
			window.history.pushState(null, '', path);
		});

		function appendScript(path: string) {
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.setAttribute('type', 'module');
			script.text = `import "${path}";`;
			editor.dom.doc.head.appendChild(script);
		}

		// Load the umb-rte-block component inside the iframe [NL]
		appendScript('@umbraco-cms/backoffice/extension-registry');
		appendScript(UMB_BLOCK_ENTRY_WEB_COMPONENTS_ABSOLUTE_PATH);
	},

	style_formats: [
		{
			title: 'Headers',
			items: [
				{ title: 'Page header', block: 'h2' },
				{ title: 'Section header', block: 'h3' },
				{ title: 'Paragraph header', block: 'h4' },
			],
		},
		{
			title: 'Blocks',
			items: [{ title: 'Paragraph', block: 'p' }],
		},
		{
			title: 'Containers',
			items: [
				{ title: 'Quote', block: 'blockquote' },
				{ title: 'Code', block: 'code' },
			],
		},
	],
	/**
	 * @description The maximum image size in pixels that can be inserted into the editor.
	 * @remarks This is registered and used by the UmbMediaPicker plugin
	 */
	maxImageSize: 500,
};
