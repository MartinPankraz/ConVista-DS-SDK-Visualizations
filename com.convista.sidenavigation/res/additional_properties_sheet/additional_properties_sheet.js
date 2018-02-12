sap.designstudio.sdk.PropertyPage.subclass("com.convista.sidenavigation.APS",  function() {

	var that = this;
	
	this.init = function() {
//		eclipse_logJavaScriptMessage("init","error");
		
		sap.ui.getCore().attachInit(function() {
		   "use strict";
		   that.controller = new sap.ui.controller("MyController", {
			   onInit : function (evt) {
					var oModel = new sap.ui.model.json.JSONModel();
					var flex = that.callRuntimeHandler("getJsonItems");
					var fixed = that.callRuntimeHandler("getJsonFixedItems");
					oModel.setData({
						"flex": flex,
						"fixed": fixed
					});
					this.getView().setModel(oModel);
//					var test = that.callRuntimeHandler("getJsonItems");
//					eclipse_logJavaScriptMessage("test "+test,"error");
				},
				
				onExit : function () {
					if (this._oPopover) {
						this._oPopover.destroy();
					}
				},
				
				synch: function(oEvent){
					that.firePropertiesChanged(["jsonFixedItems", "jsonItems"]);
				},
				
				handleExpandedCheckbox: function(oEvent){
					that.firePropertiesChanged(["navigationExpanded"]);
				},
				
				handleAddButtonPress: function(oEvent){
					var me = this;
					// create popover
					if (!this._oPopover) {
						this._oPopover = sap.ui.xmlfragment({
							id: "createItemPopover",
							fragmentContent: jQuery("#myFragment").html()
						}, this);//sap.ui.xmlfragment("createItemPopover","myFragment", this);
						
						this.getView().addDependent(this._oPopover);
					}
					
					var selectedPage = this.getView().byId("navCon").getCurrentPage().getId().split("--")[1];
					if(selectedPage === "subView"){
						sap.ui.core.Fragment.byId("createItemPopover","iconInput").setVisible(false);
					}else{
						sap.ui.core.Fragment.byId("createItemPopover","iconInput").setVisible(true);
					}
		 
					// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
					var oButton = oEvent.getSource();
					jQuery.sap.delayedCall(0, this, function () {
						me._oPopover.openBy(oButton);
					});
				},
				
				handleCreatePress: function(oEvent){
					var key = sap.ui.core.Fragment.byId("createItemPopover","keyInput").getValue();
					var text = sap.ui.core.Fragment.byId("createItemPopover","textInput").getValue();
					var icon = sap.ui.core.Fragment.byId("createItemPopover","iconInput").getValue();
					
					var propertyPath = "/flex";
					var selectedTabKey = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
					var selectedPage = this.getView().byId("navCon").getCurrentPage().getId().split("--")[1];
					var object = "";
					var secondModel = this.getView().byId("subItemList").getModel("sub");

					if(selectedPage === "mainView"){
						if(selectedTabKey === "fixItems"){
							propertyPath = "/fixed";
						}
						object = {"text":text,"key":key,"icon":icon, "sub":[]};
					}else{
						propertyPath = this.sPath + "/sub";
						object = {"text":text,"key":key};
					}
					
					var data = this.getView().getModel().getProperty(propertyPath);
					var keyAlreadyUsed = false;
					for(var i = 0; i < data.length; i++){
						if(data[i].key === key){
							keyAlreadyUsed = true;
							break;
						}
						if(data[i].sub){
							for(var j = 0; j < data[i].sub.length; j++){
								if(data[i].sub[j].key === key){
									keyAlreadyUsed = true;
									break;
								}	
							}	
						}
					}
					if(keyAlreadyUsed || key === ""){
						sap.m.MessageToast.show("Key already used or empty! It needs to be unique!");
						sap.ui.core.Fragment.byId("createItemPopover","keyInput").setValueState("Error");
					}else{
						data.push(object);
						this.getView().getModel().setProperty(propertyPath, data);
						
						if(selectedPage === "subView"){
							secondModel.setProperty("/subItems", data);
						}
						sap.ui.core.Fragment.byId("createItemPopover","keyInput").setValueState("None");
						this._oPopover.close();	
					}
				},
				
				handleDeleteButtonPress: function(oEvent){
					var oList = oEvent.getSource().getParent();
					var sPath = "";
					var selectedPage = this.getView().byId("navCon").getCurrentPage().getId().split("--")[1];
		 
					// after deletion put the focus back to the list
					oList.attachEventOnce("updateFinished", oList.focus, oList);
					
					var data = null;
					var propertyPath = "/flex";
					var item = null;
					var selectedTabKey = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
					if(selectedPage === "mainView"){
						if(selectedTabKey === "fixItems"){
							propertyPath = "/fixed";
						}
						data = this.getView().getModel().getProperty(propertyPath);
						sPath =	oList.getBindingContext().getPath();
						item = this.getView().getModel().getProperty(sPath);
					}else{
						sPath =	oList.getBindingContext("sub").getPath();
						propertyPath = this.sPath + "/sub";
						data = this.getView().byId("subItemList").getModel("sub").getProperty("/subItems");
						item = this.getView().byId("subItemList").getModel("sub").getProperty(sPath);
					}
					
					var idx = -1;
					for(var i = 0; i < data.length; i++){
						if(data[i].key === item.key){
							idx = i;
							break;
						}
					}
					if(idx >= 0){
						data.splice(idx,1);
						this.getView().getModel().setProperty(propertyPath, data);
						if(selectedPage !== "mainView"){
							this.getView().byId("subItemList").getModel("sub").setProperty("/subItems", data);
						}
					}
				},
				
				handleMoveUp: function(oEvent){
					var oList = oEvent.getSource().getParent(),
					sPath = "";
					var selectedPage = this.getView().byId("navCon").getCurrentPage().getId().split("--")[1];
		 
					// after deletion put the focus back to the list
					oList.attachEventOnce("updateFinished", oList.focus, oList);
		 
					var propertyPath = "/flex";
					var data = null;
					var selectedTabKey = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();

					if(selectedPage === "mainView"){
						if(selectedTabKey === "fixItems"){
							propertyPath = "/fixed";
						}
						data = this.getView().getModel().getProperty(propertyPath);
						sPath =	oList.getBindingContext().getPath();
					}else{
						sPath =	oList.getBindingContext("sub").getPath();
						propertyPath = this.sPath + "/sub";
						data = this.getView().byId("subItemList").getModel("sub").getProperty("/subItems");
					}
					
					var idx = parseInt(sPath.split("/").pop(), 10);
					//var item = this.getView().getModel().getProperty(sPath);
					if(idx === 0){
						idx = data.length - 1;
					}
					this.arrayMove(data, idx, idx - 1);
					
					this.getView().getModel().setProperty(propertyPath, data);
					if(selectedPage !== "mainView"){
						this.getView().byId("subItemList").getModel("sub").setProperty("/subItems", data);
					}
				},
				
				handleMoveDown: function(oEvent){
								var oList = oEvent.getSource().getParent(),
					sPath = "";
					var selectedPage = this.getView().byId("navCon").getCurrentPage().getId().split("--")[1];
		 
					// after deletion put the focus back to the list
					oList.attachEventOnce("updateFinished", oList.focus, oList);
		 
					var propertyPath = "/flex";
					var data = null;
					var selectedTabKey = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();

					if(selectedPage === "mainView"){
						if(selectedTabKey === "fixItems"){
							propertyPath = "/fixed";
						}
						data = this.getView().getModel().getProperty(propertyPath);
						sPath =	oList.getBindingContext().getPath();
					}else{
						sPath =	oList.getBindingContext("sub").getPath();
						propertyPath = this.sPath + "/sub";
						data = this.getView().byId("subItemList").getModel("sub").getProperty("/subItems");
					}
					
					var idx = parseInt(sPath.split("/").pop(), 10);
					//var item = this.getView().getModel().getProperty(sPath);
					if(idx === data.length - 1){
						idx = 0;
					}
					this.arrayMove(data, idx, idx + 1);
					
					this.getView().getModel().setProperty(propertyPath, data);
					if(selectedPage !== "mainView"){
						this.getView().byId("subItemList").getModel("sub").setProperty("/subItems", data);
					}
				},
				
				handleClosePress: function(oEvent){
					this._oPopover.close();
				},
				
				handleSubNavigation: function(oEvent){
					var oNavCon = this.getView().byId("navCon");
					var detailView = this.getView().byId("subView");
					
					var oList = oEvent.getSource().getParent();
					this.sPath = oList.getBindingContext().getPath();
					var data = this.getView().getModel().getProperty(this.sPath);
					
					var subModel = new sap.ui.model.json.JSONModel();
					var subItemList = this.getView().byId("subItemList");
					subItemList.setModel(subModel, "sub");
					subModel.setData({"subItems":data.sub});

					detailView.setTitle("Configuration for " + data.text);
					oNavCon.to(detailView);
				},
				
				onNavBack: function(oEvent){
					var oNavCon = this.getView().byId("navCon");
					oNavCon.back();	
				},
				
				arrayMove: function(arr, fromIndex, toIndex) {
				    var element = arr[fromIndex];
				    arr.splice(fromIndex, 1);
				    arr.splice(toIndex, 0, element);
				}
			});
		   
		   that.view = new sap.ui.xmlview({
		     viewContent: jQuery("#myView").html()
		   }).placeAt("content");

		 });
	};
	
	this.beforeUpdate = function() {
		
	};
	
	this.afterUpdate = function() {
//		eclipse_logJavaScriptMessage("update0","error");
//		eclipse_logJavaScriptMessage("update1","error");
	}

	this.navigationExpanded = function(value) {
		if (value === undefined) {
			return that.view.byId("sideNavExpanded").getSelected();
		}
		else {
			that.view.byId("sideNavExpanded").setSelected(value);
			return this;
		}
	};
	
	this.jsonItems = function(value) {
		if (value === undefined) {
			return JSON.stringify(that.view.getModel().getData()["flex"]);
		}
		else {
			that.view.getModel().setProperty("/flex", JSON.parse(value));
			return this;
		}
	};

	this.jsonFixedItems = function(value) {
		if (value === undefined) {
			return JSON.stringify(that.view.getModel().getData()["fixed"]);
		}
		else {
			that.view.getModel().setProperty("/fixed", JSON.parse(value));
			return this;
		}
	};
	
});