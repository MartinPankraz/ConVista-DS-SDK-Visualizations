/** 
 * @version 1.0
 * @copyright ConVista
 * @author Martin Pankraz
 *
 * @classdesc  
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */
sap.designstudio.sdk.Component.subclass("com.convista.comment.Comment", /** @memberOf com.convista.comment */function() {

	var saveServerURL = null;
	var saveHttpMethod= null;
	var saveHTMLData  = null;
	var dataTrigger	  = null;
	var saveToolbars  = null;
	
	var _id = null;
	
	var that = this;

	this.init = function() {
		
		this.editorLoaded = false;
		this.CKReplacedOnce = false;
		this.toolbarChanged = false;
		
		var id = "editor"+getTimeStamp();
		
		var popin = '<form>'+
        '<textarea name="editor" id="'+id+'"></textarea>'+
        '<script>'
        	'CKEDITOR.replace( "'+id+'" );'+
        '</script>'+
        '</form>';
		this.ta = $(popin);
		this.$().append(this.ta);
		
		//wait for CKEditor to finish
		// Need to wait for the ckeditor instance to finish initialization
	    // because CKEDITOR.instances.editor.commands is an empty object
	    // if you try to use it immediately after CKEDITOR.replace('editor');
	    CKEDITOR.on('instanceReady', function (ev) {

	        // Create a new command with the desired exec function
	    	that.editor = ev.editor;
	    	that.editorLoaded = true;
	    	
			var overridecmd = new CKEDITOR.command(that.editor, {
	            exec: function(editor){
	            	//'http://saps073.sap.convista.local:8000/sap/bc/webrfc?_FUNCTION=Z_WEBRFC_JSON',
					that.fireEvent("onSave");
	        	}
	        });
	        // Replace the old save's exec function with the new one
	        that.editor.commands.save.exec = overridecmd.exec;
	    });

		this.myId(id);
		//remember unique identifier for every instance of CKEditor
		this.firePropertiesChanged(["myId"]);
	};

	this.afterUpdate = function() {
				
		var myData = that.htmldata();
		var trigger = this.saveDataTrigger();
	    
	    var myToolbarGroups = [];
	    
	    //push default toolbar
	    myToolbarGroups.push({name:"basicstyles", groups:[ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ]});
	    
	    var toolbarGroupsEntryDocument = {};
	    
	    for(var itm in saveToolbars){
	    	var toolbarGroupsEntry = {};
	    	toolbarGroupsEntry.name = itm;
	    	var groupActive = saveToolbars[itm];
	    	if(groupActive){
	    		if(itm === 'document'){
	    			toolbarGroupsEntryDocument.name = toolbarGroupsEntry.name;
	    			toolbarGroupsEntryDocument.groups = [ 'mode', 'document', 'doctools' ];
	    			var doc_itms = [];
	    			for(var doc_itm in groupActive){
	    				if(groupActive[doc_itm]){
	    					doc_itms.push(doc_itm);
	    				}
	    			}
	    			//make sure save is always present!
	    			doc_itms.push("-");
	    			doc_itms.push("Save");
	    			toolbarGroupsEntryDocument.items = doc_itms;
	    		}else if(itm === 'clipboard'){
	    			toolbarGroupsEntry.groups = [ 'clipboard', 'undo' ];
	    			toolbarGroupsEntry.items = [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ];
	    		}else if(itm === 'editing'){
	    			toolbarGroupsEntry.groups = [ 'find', 'selection', 'spellchecker' ];
	    			toolbarGroupsEntry.items = [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ];
	    		}else if(itm === 'paragraph'){
	    			toolbarGroupsEntry.groups = [ 'list', 'indent', 'blocks', 'align', 'bidi' ];
	    			toolbarGroupsEntry.items = [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ];
	    		}else if(itm === 'forms'){
	    			toolbarGroupsEntry.items = [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ];
	    		}else if(itm === 'links'){
	    			toolbarGroupsEntry.items = [ 'Link', 'Unlink', 'Anchor' ];
	    		}else if(itm === 'insert'){
	    			toolbarGroupsEntry.items = [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ];
	    		}else if(itm === 'styles'){
	    			toolbarGroupsEntry.items = [ 'Styles', 'Format', 'Font', 'FontSize' ];
	    		}else if(itm === 'colors'){
	    			toolbarGroupsEntry.items = [ 'TextColor', 'BGColor' ];
	    		}else if(itm === 'tools'){
	    			toolbarGroupsEntry.items = [ 'Maximize', 'ShowBlocks' ];
	    		}else if(itm === 'about'){
	    			toolbarGroupsEntry.items = [ 'About' ];
	    		}else{
	    			if(window.console)console.log("Toolbar group unkown: "+itm)
	    		}
	    		//save document group at last so that the toolbar appears at the bottom right corner
	    		if(itm !== 'document'){
		    		myToolbarGroups.push(toolbarGroupsEntry);	
	    		}
	    	}
	    }
	    myToolbarGroups.push(toolbarGroupsEntryDocument);
    	//you can run CKCKEDITOR.replace() only once!
	    if(!this.CKReplacedOnce && _id !== ""){
	    	var id = this.myId();
		    CKEDITOR.replace(id,{ toolbar: myToolbarGroups });
	    	this.CKReplacedOnce = true;
	    }
	    
	    if(this.toolbarChanged){
	    	var id = this.myId();
	    	CKEDITOR.instances[id].destroy();
	    	CKEDITOR.replace(id, { toolbar: myToolbarGroups });
	    	
	    	that.toolbarChanged = false;
	    }
		
		if(trigger !== null && trigger !== ""){
			that.OverrideCommand();
			//Make sure to reset the data indicator
			this.saveDataTrigger("");
			this.firePropertiesChanged(["saveDataTrigger"]);
		}
		
		if(this.editorLoaded){
		    if(myData !== null && this.editor !== undefined && this.editor.document !== undefined){
				this.editor.document.getBody().setHtml(myData);
			}
		}
		        
	};
	
	this.OverrideCommand = function(){
		
		var httpMethod = this.DHttpMethod();
		var serverUrl = this.DServerUrl();
		
        var xhr = new XMLHttpRequest();
		xhr.open( httpMethod, serverUrl, true);
		xhr.withCredentials = "true";
		xhr.ontimeout = function () {
			if(window.console)console.log("XHR timeout!");
		};
		xhr.onreadystatechange = function(response){
			//request finished and response ready
			if (xhr.readyState == 4){
				if(xhr.status == 200){
					var resp = response.target.response;
					that.editor.document.getBody().setHtml(resp);
					that.htmldata(resp);
					that.firePropertiesChanged(["htmldata"]);
				}else{
					if(window.console)console.log("error "+response.target.statusText);
				}
		    }
		};
		if(httpMethod === "POST"){
			xhr.send(that.editor.document.getBody().getHtml());	
		}else{
			xhr.send();	
		}	   
	}
	
	this.DHttpMethod = function(value) {
		if (value === undefined) {
			return saveHttpMethod;
		} else {
			saveHttpMethod = value;
			return this;
		}
	};
	
	this.DServerUrl = function(value) {
		if (value === undefined) {
			return saveServerURL;
		} else {
			saveServerURL = value;
			return this;
		}
	};
	
	this.htmldata = function(value) {
		if (value === undefined) {
			return saveHTMLData;
		} else {
			saveHTMLData = value;
			return this;
		}
	};
	
	this.saveDataTrigger = function(value) {
		if (value === undefined) {
			return dataTrigger;
		} else {
			dataTrigger = value;
			return this;
		}
	};
	
	this.toolbars = function(value) {
		if (value === undefined) {
			return saveToolbars;
		} else {
			if(value !== ""){
				if(saveToolbars !== null){
					that.toolbarChanged = true;
				}
			}
			saveToolbars = value;
			return this;
		}
	};
	
	this.myId = function(value) {
		if (value === undefined) {
			return _id;
		} else {
			_id = value;
			return this;
		}
	};
	
	function getTimeStamp(){
		return new Date().getTime();
	}
	
});
