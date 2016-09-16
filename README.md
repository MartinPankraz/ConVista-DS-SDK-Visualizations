ConVista-DS-SDK-Visualizations
==============================
Design Studio SDK Visualization Components by ConVista Consulting to enhance Dashboard KPI analysis and visualization with state-of-the-art maps technology, HTML editors to put some shiny comments, hierarchy selection and a chat component.

See also my blog entries on SCN regarding
maps: http://scn.sap.com/community/businessobjects-design-studio/blog/2014/12/01/google-maps-and-openstreetmap-component-sdk-development-insights

DesignStudio comments: 
http://scn.sap.com/community/businessobjects-design-studio/blog/2016/03/11/self-made-designstudio-sdk-dashboard-comments

Hierarchy selection component:
http://scn.sap.com/community/businessobjects-design-studio/blog/2016/08/12/design-studio-sdk-hierarchy-selector-component-go-catch-em-all

<b>Breaking News: New Components Hierarchy Selector and ConVista SDK Chat added to the repository.</b>

Find detailed descriptions and an API overview here: http://martinpankraz.github.io/ConVista-DS-SDK-Visualizations/

Prerequisites
-------------
Design Studio, Release 1.6 SP0 or higher


SAP BW, UNX or HANA as DataSources with a type of address data, which can then be mapped by Google’s geocoder API (e.g. Rheinauhafen 15, Cologne) or represent lat-long values right away. Alternatively you could also use my custom data source providing test data for a quick hands-on.

https://github.com/MartinPankraz/DesignStudioSDK-Components/blob/master/DesignStudioSDKComponentsPack_14.zip

NetWeaver or BO sever platform to deploy the extensions for production purposes (local mode works out of the box)

Google API Key that you can get from Google’s API Console (please note that local mode works without a key). The key will be used for Google's geocoder (used by both components). If you stick to the lat-long only version you don't need a key.


Contents
--------
• ConVista EasyComment

• ConVista Hierarchy Selector

• ConVista Chat

• ConVista GoogleMap & OSM


ConVista EasyComment
--------------------
This component enables you to put comments onto your dashboard. You can find a detailed description how to integrate it with SAP backend here: 

<b>Properties</b>

You can customize the commentary editor toolbars using the property Toolbar Settings. For the Document toolbar you can even decide on item level. Please note that the save button will always be present because it is tied to the On Save Button Clicked event.

<b>Events</b>

The On Save Button Click Event exposes the functionality of the toolbar save button. That way you can put DesignStudio scripting which executes after clicking the editor's save button. How to integrate with your backend using this event is discussed in the SCN blog entry already mentioned above.

ConVista Chat
--------------------
This component enables you to setup a fully blown chat component. For backend integration we recommend using the SCN SDK component WSPusher which is an implementation of the WebSocket standard also done by me. You can find the code and the component here: https://github.com/org-scn-design-studio-community/sdkpackage

<b>Properties</b>

• <i>Chat Messages</i>

This property allows you to define messages upfront manually. Furthermore it is used when messages are added to the component through Design Studio Scripting. It uses the new SDK type Array and Object.

• <i>Enable SAP Social (commons only)</i>

Enable the UI5 social feature. This adds a "reply" text link to your messages, which opens an input dialog. The user's actions are exposed to the chat components events. This feature is only available if the component is run in commons mode.

• <i>Date Pattern</i>

Define the date pattern using LDML format which is required by sap.ui.core.format.DateFormat.

• <i>Date Style</i>

Define the date style using LDML format which is required by sap.ui.core.format.DateFormat.

<b>Methods</b>

• <i>createMessage</i>

Create a message using current timestamp.

• <i>addMessage</i>

Add a new message defining all properties yourself.

• <i>addMessageList</i>

Add a list of messages to the chat component. The JSON strings needs the following structure:

	[{
		"myId": "1",
		"chatId": "TEST",
		"user": "Martin",
		"title": "My first commons post!",
		"datetime": "20160905100120",
		"text": "This is looking really cool. What do you think Jose?",
		"picture": "zen/mimes/TEST_TIMELINE/img/mpankraz.jpg",
		"priority": "Low"
	},
	{…}]
	
The optional flag override enables you to decide if you want to append messages or replace with new ones.

• <i>getCurrentActiveMessageId</i>

Get identifier (JSON attribute myId) of last selected chat item.

• <i>clear</i>

Clear complete chat view.

• <i>deleteMessage</i>

Delete single message by id from chat view.

• <i>deleteMessages</i>

Delete list of messages by array of ids from chat view. The JSON strings needs the following structure:

[1, 2, 3, 4568, 455]



<b>Events</b>

• <i>On Reply (commons mode only)</i>

This even fires if send button the SAP social inpu dialog is hit. This event is only active if the component is run in commons mode.

• <i>On Message Close/Select</i>

This event fires in case an item of the chat component is clicked. It makes sense to call the method getCurrentActiveMessageId along with it to learn which item was clicked.

ConVista Hierarchy Selector
---------------------------
This component enables you to consume BW hierarchies exposed through data sources. One single root node is a minimum requirement for the hierarchy. Otherwise only the branch for the first node will be shown. 

<b>Properties</b>

• <i>Navigation Mode</i>

Use Paginator or Scrollbar in case of display overflow

• <i>Visible Row Count</i>

Decide how many rows shall be displayed initially

• <i>Visible Row Count Mode</i>

Decide if the component shall stretch automatically (auto), stay fixed (fixed) or be flexible (interactive)

• <i>Row Height in px</i>

Define the amount of pixel to be used for each row height

• <i>Level for Expand All Option</i>

Define the level to which the tree shall expand on click of the top right button

• <i>Expand first Level on Start</i>

Decide if the root node shall be collapsed at start or not

• <i>Display row lines</i>

Decide if you want to see the table row lines or not

• <i>Hide Key on KEY_TEXT display</i>

In order to be able to use the method <i>getSelectionKeysBexReady</i> for external keys you will need to enable key_text or text_key as display option on your data source. The reason is that the external representation of the key is transmitted to the SDK component only then. Having done that you might still want to show only the text on the tree. This option will allow you to do so.

<b>Important Methods</b>

• <i>getSelectionKeysBexReady(boolean internalKeyFormat,optional boolean completeKey)</i>

You have to decide if you want the shortened internal or the external representation of the key (please not my comment regarding that above). If you need the full technical key (e.g. 0HIERARCHY/0HIER_NODE/1234) flag the optional second parameter completeKey with true.

• <i>getFilterExtBexReady()</i>

This method will return a string which can be fed into Design Studio Scripting method setFilterExt right away. It even takes care of SAP's special node syntax (e.g +OPERATIVE CASH FLOWS(Text Node))

<b>Events</b>

The On CheckBox Selected Event fires every time the user hits a checkbox on the tree.


ConVista Maps Implementation
----------

The following section covers the properties, functions and events of our google maps and OpenStreetMap implementation. Our OSM component is deprecated by now because SAP offers a standard version.

Maps Properties
----------
<b><i>DataBinding group</i></b>

Specify the DataSource containing the data to be visualized with maps extension here. Please note that SAP has specified a limit of 10,000 data cells that can be transferred to SDK extensions (see SAP Design Studio Developer Guide on that matter).

<b><i>Geo Database group</i></b>

<b>CSS Class</b>

Name your custom CSS class to override default behavior

<b>Address DB URL</b>

Specifies URL where Apache CouchDB is running. Please note that you might need to set CORS settings due to CROSS ORIGIN request policy in browsers.

Default is http://127.0.0.1:5984/ [your database name].

Use GET to gather info and POST to add geo data. Just ask me if you need further information.

<b>Address DB URL Extension</b>

URL extension for REST interface to read geo data bulk-wise from Apache CouchDB. Default is:

/_all_docs?include_docs=true

<b>Google API Key</b>

This field contains your Google API key (can be left empty in local mode for development purposes)
<br>

You can leave all of the above entries empty if you want to use the new lat-long feature.
<br>

<b><i>Display group</i></b>

<b>Address Dimension</b>

Specifies the dimension (or column name) in your DataSource, containing the address data, for example “Rheinauhafen 15, Cologne”. If you want to use the lat-long feature leave it empty!

<b>Latitude Dimension</b>

Specifies the dimension (or column name) in your DataSource, containing the latitude data, for example “50.927276”. You will need to look up the key figure/characteristic's name on the data sources initial view

<b>Longitude Dimension</b>

Specifies the dimension (or column name) in your DataSource, containing the longitude data, for example “6.966115”. You will need to look up the key figure/characteristic's name on the data sources initial view

<b>Clustering Max Zoom</b>

Specifies the maximum zoom level until when to use the clustering mechanism. If you zoom further in clustering will be switched off and activated again on zoom out.

<b>Marker-Content Dimension</b>

Specifies the dimension (or row/column name) in your DataSource, containing the data to be displayed when a marker (not a cluster) is clicked

<b>Date Dimension</b>

Specifies the dimension (or row/column name) in your DataSource, containing the dates associated with your key figures

<b>Keyfigure1 Name</b>

Specifies the dimension (or row/column name) in your DataSource, containing your first key figure

<b>Keyfigure1 (t-1)</b>

This dimensions specification enables users to display the key figure value developments over time. For example:
Actual cost		|	Actual cost (last year)
€1234,56		|	€1000,00
Trends will be displayed by green or red arrows in combination with corresponding percentages next to a clustered marker.

<b>Keyfigure1 Clustering Steps</b>

Specifies the value limits for different display behavior. For example, green (10), yellow or red (500) cluster marker. Example input: ["10","50","100","200","500"]. This is also customizable via CSS.

<b>Keyfigure2 Name</b>

Specifies the dimension (or row/column name) in your DataSource containing your second key figure

<b>Keyfigure2 (t-1)</b>

Works accordingly to Keyfigure1

<b>Keyfigure2 Clustering Steps</b>

Works accordingly to Keyfigure1

<b>Keyfigure Variation Tolerance (%)</b>

Specifies the tolerance (in percentage) used to suppress trend display. Typically users want a 5% discrepancy interval that should be treated as stagnation.

Events
------
<b>On Marker Clicked</b>

This event occurs in case a plain marker (not a clustered one) is clicked. This action opens a message box on the map displaying the data specified in property Marker-Content Dimension and enables you also to handle marker information (for example address, ID, etc.) outside the extension e.g. for further filtering in charts.

<b>On Cluster Clicked</b>

This event works the same way but on cluster level with the exception that no message box is displayed. The clicked cluster is highlighted instead.

Extensions API
--------------
The following methods are available in SAP Design Studios Script Editor for the extension components.

<b>String getAddress()</b>

Returns address information associated with the last clicked marker. (You should call this one within the event handler for marker clicked.)

<b>String getClusterSelection(String dimension)</b>

Returns the information specified by the method argument dimension (e.g. “Date”) that is associated with the last clicked cluster (you should call this one within the event handler for cluster clicked) as a JSON object.
For example:
{“dimension_name”: [“20140101”,”20140102”,…]}

<b>String getMarkerSelection(String dimension)</b>

Returns the information specified by the method argument dimension (e.g. “Date”) that is associated with the last clicked marker (you should call this one within the event handler for marker clicked) as a JSON object.
For example:
'{“dimension_name”: [“20140101”,”20140102”,…]}'

<b>String getClusterSelectionFilterData(String dimension)</b>

Returns the information (without dimension name, just raw data) specified by the method argument dimension (e.g. “Date”) that is associated with the last clicked cluster (you should call this one within the event handler for cluster clicked) as a JSON object.
For example:
[“20140101”,”20140102”,…]	->	This can be used for chart filtering for instance.

<b>String getMarkerSelectionFilterData(String dimension)</b>

Returns the information (without dimension name, just raw data) specified by the method argument dimension (e.g. “Date”) that is associated with the last clicked marker (you should call this one within the event handler for marker clicked) as a JSON object.
For example:
[“20140101”,”20140102”,…]	->	This can be used for chart filtering for instance.

<b>void setCurrentKeyfigureDisplay(String keyFigureName)</b>

Changes the key figure display setting for all of the clusters during runtime. This way you can control programmatically which key figure is shown to the user.

<b>String getCurrentKeyfigureDisplay()</b>

Returns the current key figure name used to display key figures on clusters.

<b>void centerMap(lat, lon, zoom)</b>

Center map on lat/lon and zoom level. For example DATAMAP_1.centerMap(-52.31041, -63.62642, 8); 

<b>float getCenterLatitude</b>

Get latitude of last center specification.

<b>float getCenterLongitude</b>

Get longitude of last center specification.

<b>int getClusteringMaxZoom</b>

Retrieve max zoom level setting

<b>void setClusteringMaxZoom</b>

Set max zoom level setting

<b>int getZoom</b>

Get  current maps zoom level

Geo Coding and Geo-Data Persistence
-----------------------------------
Google’s geo coding API can be used for free to a certain degree. In order to lighten workload on your account we have introduced two possible ways to store your geo-referenced data that has been determined by the API at first run. The first approach is by installing an Apache CouchDB instance and pointing the extension to the database URL. Secondly you can use current browser’s internal IndexedDB which sets up a full blown database that is tied to your domain. With IndexedDB, please note that for development purposes, you might need to use a static jetty port, as that is already part of the domain. Otherwise you might set up a database instance with every program execution during SDK development. This is no problem outside the SDK. You could also possibly use a different RESTful and JSON-capable database instead of CouchDB. Just give me a hint if you need further information or assistance on that matter.

<b>If you are using the new lat-long feature the above section regarding geo coding and data persistence doesn't apply to you</b>

How it works (short version)
----------------------------
On first run the app logic will look for key figures and their corresponding description dimensions in the attached DataSource. Setting up all of your markers and clusters will take some time as the geocoder restricts traffic while using the free plan. Persistent storage of your geo data will make sure you don’t call the API more than once for every address entry in your DataSource (see section above).
Any update, for example applying an arbitrary filter, to the underlying DataSource will also be propagated to the extension and impact on your view immediately.

<b><i>Again, if you are using the new lat-long feature this section doesn't apply to you. Your makers will show up right away.</i></b>

<b>ConVista OpenStreetMap</b>

This extension uses OpenStreetMap (OMS) as map implementation and the Leaflet framework to work with the map itself.
In contrast to Google Maps, OMS enables you to host your own tiles server. That way you can be independent from external resources and even work offline.

Please note the new lat-long feature is not implemented for my OpenStreetMap because the SAP geomap handles that rather nicely already.

<b>ConVista GoogleMap</b>

This extension uses Google Maps as map implementation and the Google Maps JavaScript API v3 to work with the map itself. Google StreetView is also available. As of today (12th of October 2015) you can use lat-long values provided by your data sources just like with the SAP geomap.

Functionality to display trends in key figure development over time, next to the clusters is not yet implemented. This is only available with OSM right now.

Please note that you shouldn’t use both components at a time in one Dashboard. This is a result of the mechanism that enables us to insert your Google API key at design time as you specified it in the component’s properties. If you can't help it contact me for a quick workaround.

<b>Test data out of the box with custom data source (DS 1.4+ required!)</b>

If you don't have any geo-referencable data ready to display on our maps extensions or you just want to get a quick hands-on, donwload my custom data source <i>MapsExampleDataSource</i> from https://github.com/MartinPankraz/DesignStudioSDK-Components and include it to your project and the maps extensions as usual.


Installation
------------
•	Download the ConVistaMapsExtension.zip ZIP file. You may do this by clicking the Download ZIP button. Please note that you will need to extract the container zip first before you can reach the ConVistaMapsExtension.zip

•	Click Tools in Design Studio > install Extension to Design Studio…

•	Choose “archive” as installation source (navigate to ZIP file) in dialog

•	Accept license and restart Design Studio

•	Have fun using our extensions

Meet me at ConVista Infoday or our world renowned carnival (traditional German costume festival) event in Cologne to chat about our Design Studio and Dashboarding ideas :-)

Trouble shooting
----------------
Please note that Design Studio's background processing functionality in combination with <i>hideLoadingState</i> on one of the maps will result in strange marker update behavior. It seems like the DS framework doesn't update the extension's hooks correctly. You may, however use background processing without hiding loading state of the map just fine.

License
-------
This software product is licensed under the Apache License 2.0.


Final Words
-----------
Feel free to contact me for any advice on usage, installation, and plain trouble shooting or a chat about the awesomeness of Design Studio SDK if you like. Feedback and improvement suggestions are also very welcome.

martin.pankraz@convista.com
