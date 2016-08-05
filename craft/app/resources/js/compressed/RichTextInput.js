/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://craftcms.com/license Craft License Agreement
 @see       http://craftcms.com
 @package   craft.app.resources
*/
(function(e){Craft.RichTextInput=Garnish.Base.extend({id:null,linkOptions:null,assetSources:null,elementLocale:null,redactorConfig:null,$textarea:null,redactor:null,linkOptionModals:null,init:function(a){this.id=a.id;this.linkOptions=a.linkOptions;this.assetSources=a.assetSources;this.transforms=a.transforms;this.elementLocale=a.elementLocale;this.redactorConfig=a.redactorConfig;this.linkOptionModals=[];this.redactorConfig.lang||(this.redactorConfig.lang=a.redactorLang);this.redactorConfig.direction||
(this.redactorConfig.direction=a.direction||Craft.orientation);this.redactorConfig.imageUpload=!0;this.redactorConfig.fileUpload=!0;this.redactorConfig.dragImageUpload=!1;this.redactorConfig.dragFileUpload=!1;"object"!==typeof this.redactorConfig.plugins&&(this.redactorConfig.plugins=[]);if(this.redactorConfig.buttons){-1!==(a=e.inArray("html",this.redactorConfig.buttons))&&(this.redactorConfig.buttons.splice(a,1),this.redactorConfig.plugins.unshift("source"));-1!==(a=e.inArray("formatting",this.redactorConfig.buttons))&&
this.redactorConfig.buttons.splice(a,1,"format");for(var c=["unorderedlist","orderedlist","undent","indent"],b,d=0;d<c.length;d++)-1!==(a=e.inArray(c[d],this.redactorConfig.buttons))&&(this.redactorConfig.buttons.splice(a,1),"undefined"==typeof b||a<b)&&(b=a);"undefined"!=typeof b&&this.redactorConfig.buttons.splice(b,0,"lists")}b={init:Craft.RichTextInput.handleRedactorInit};if("object"==typeof this.redactorConfig.callbacks)for(d in b)"undefined"!=typeof this.redactorConfig.callbacks[d]&&(this.redactorConfig.callbacks[d]=
this.mergeCallbacks(b[d],this.redactorConfig.callbacks[d]));else this.redactorConfig.callbacks=b;this.$textarea=e("#"+this.id);this.initRedactor();"undefined"!=typeof Craft.livePreview&&(Craft.livePreview.on("beforeEnter beforeExit",e.proxy(function(){this.redactor.core.destroy()},this)),Craft.livePreview.on("enter slideOut",e.proxy(function(){this.initRedactor()},this)))},mergeCallbacks:function(a,c){return function(){a.apply(this,arguments);c.apply(this,arguments)}},initRedactor:function(){Craft.RichTextInput.currentInstance=
this;this.$textarea.redactor(this.redactorConfig);delete Craft.RichTextInput.currentInstance},onInitRedactor:function(a){this.redactor=a;this.redactor.opts.toolbar&&this.customizeToolbar();this.leaveFullscreetOnSaveShortcut();this.redactor.core.editor().on("focus",e.proxy(this,"onEditorFocus")).on("blur",e.proxy(this,"onEditorBlur"));this.redactor.opts.toolbarFixed&&!Craft.RichTextInput.scrollPageOnReady&&(Garnish.$doc.on("ready",function(){Garnish.$doc.trigger("scroll")}),Craft.RichTextInput.scrollPageOnReady=
!0)},customizeToolbar:function(){if(this.assetSources.length){var a=this.replaceRedactorButton("image",this.redactor.lang.get("image")),c=this.replaceRedactorButton("file",this.redactor.lang.get("file"));a&&this.redactor.button.addCallback(a,e.proxy(this,"onImageButtonClick"));c&&this.redactor.button.addCallback(c,e.proxy(this,"onFileButtonClick"))}else this.redactor.button.remove("image"),this.redactor.button.remove("file");if(this.linkOptions.length&&(a=this.replaceRedactorButton("link",this.redactor.lang.get("link")))){for(var c=
{},b=0;b<this.linkOptions.length;b++)c["link_option"+b]={title:this.linkOptions[b].optionTitle,func:e.proxy(this,"onLinkOptionClick",b)};e.extend(c,{link:{title:this.redactor.lang.get("link-insert"),func:"link.show",observe:{element:"a",in:{title:this.redactor.lang.get("link-edit")},out:{title:this.redactor.lang.get("link-insert")}}},unlink:{title:this.redactor.lang.get("unlink"),func:"link.unlink",observe:{element:"a",out:{attr:{"class":"redactor-dropdown-link-inactive","aria-disabled":!0}}}}});
this.redactor.button.addDropdown(a,c)}},onImageButtonClick:function(){this.redactor.selection.save();"undefined"==typeof this.assetSelectionModal?this.assetSelectionModal=Craft.createElementSelectorModal("Asset",{storageKey:"RichTextFieldType.ChooseImage",multiSelect:!0,sources:this.assetSources,criteria:{locale:this.elementLocale,kind:"image"},onSelect:e.proxy(function(a,c){if(a.length){this.redactor.selection.restore();for(var b=0;b<a.length;b++){var d=a[b],d=d.url+"#asset:"+d.id;c&&(d+=":"+c);
this.redactor.insert.node(e('<img src="'+d+'" />')[0]);this.redactor.code.sync()}this.redactor.observe.images()}},this),closeOtherModals:!1,transforms:this.transforms}):this.assetSelectionModal.show()},onFileButtonClick:function(){this.redactor.selection.save();"undefined"==typeof this.assetLinkSelectionModal?this.assetLinkSelectionModal=Craft.createElementSelectorModal("Asset",{storageKey:"RichTextFieldType.LinkToAsset",sources:this.assetSources,criteria:{locale:this.elementLocale},onSelect:e.proxy(function(a){if(a.length){this.redactor.selection.restore();
a=a[0];var c=a.url+"#asset:"+a.id,b=this.redactor.selection.text();this.redactor.insert.node(e('<a href="'+c+'">'+(0<b.length?b:a.label)+"</a>")[0]);this.redactor.code.sync()}},this),closeOtherModals:!1,transforms:this.transforms}):this.assetLinkSelectionModal.show()},onLinkOptionClick:function(a){this.redactor.selection.save();if("undefined"==typeof this.linkOptionModals[a]){var c=this.linkOptions[a];this.linkOptionModals[a]=Craft.createElementSelectorModal(c.elementType,{storageKey:c.storageKey||
"RichTextFieldType.LinkTo"+c.elementType,sources:c.sources,criteria:e.extend({locale:this.elementLocale},c.criteria),onSelect:e.proxy(function(a){if(a.length){this.redactor.selection.restore();a=a[0];var d=c.elementType.replace(/^\w|_\w/g,function(a){return a.toLowerCase()}),d=a.url+"#"+d+":"+a.id,f=this.redactor.selection.text();this.redactor.insert.node(e('<a href="'+d+'">'+(0<f.length?f:a.label)+"</a>")[0]);this.redactor.code.sync()}},this),closeOtherModals:!1})}else this.linkOptionModals[a].show()},
onEditorFocus:function(){this.redactor.core.box().addClass("focus")},onEditorBlur:function(){this.redactor.core.box().removeClass("focus")},leaveFullscreetOnSaveShortcut:function(){if("undefined"!=typeof this.redactor.fullscreen&&"function"==typeof this.redactor.fullscreen.disable)Craft.cp.on("beforeSaveShortcut",e.proxy(function(){this.redactor.fullscreen.isOpen&&this.redactor.fullscreen.disable()},this))},replaceRedactorButton:function(a,c){if(this.redactor.button.get(a).length){var b=a+"_placeholder";
this.redactor.button.addAfter(a,b);this.redactor.button.remove(a);var d=this.redactor.button.addAfter(b,a,c);this.redactor.button.remove(b);return d}}},{handleRedactorInit:function(){Craft.RichTextInput.currentInstance.onInitRedactor(this)}})})(jQuery);

//# sourceMappingURL=RichTextInput.min.map