ConVista-DS-SDK-Visualizations
==============================
Design Studio SDK Visualization Components by ConVista Consulting to enhance Dashboard KPI analysis and visualization with state-of-the-art maps technology.
Prerequisites
-------------
Design Studio, Release 1.3 SP1 or higher

SAP BW or HANA as DataSources with a type of address data, which can then be mapped by Google’s geocoder API (e.g. Rheinauhafen 15, Cologne). Alternatively you could also use my custom data source providing test data for a quick hands-on.
Please note that you will need SAP Design Studio 1.4 or higher.

https://github.com/MartinPankraz/DesignStudioSDK-Components/blob/master/DesignStudioSDKComponentsPack_14.zip

NetWeaver or BO sever platform to deploy the extensions for production purposes (local mode works out of the box)

Google API Key that you can get from Google’s API Console (please note that local mode works without a key). The key will be used for Google's geocoder (used by both components).
Contents
--------
This section briefly describes how the Design Studio extensions mentioned below work and the relevant property settings to get you up and running. The architecture and functionality of these SDK components are implemented in a very similar way to reduce maintenance efforts and continued development. Therefore all of the descriptions below will apply to both of the extensions. For differences in functionality, see section “How it works”.
Properties
----------
<b><i>DataBinding group<i><b>

Specify the DataSource containing the data to be visualized with maps extension here. Please note that SAP has specified a limit of 10,000 data cells that can be transferred to SDK extensions (see SAP Design Studio Developer Guide on that matter).

<b><i>Geo Database group<i><b>

<b>CSS Class<b>

Name your custom CSS class to override default behavior

<b>Address DB URL<b>

Specifies URL where Apache CouchDB is running. Please note that you might need to set CORS settings due to CROSS ORIGIN request policy in browsers.

Default is http://127.0.0.1:5984/[your database name].

Use GET to gather info and POST to add geo data. Just ask me if you need further information.

<b>Address DB URL Extension<b>

URL extension for REST interface to read geo data bulk-wise from Apache CouchDB. Default is:

/_all_docs?include_docs=true

<b>Google API Key<b>

This field contains your Google API key (can be left empty in local mode for development purposes)

<b><i>Display group<i><b>

<b>Address Dimension<b>

Specifies the dimension (or column name) in your DataSource, containing the address data, for example “Rheinauhafen 15, Cologne”

<b>Marker-Content Dimension<b>

Specifies the dimension (or row/column name) in your DataSource, containing the data to be displayed when a marker (not a cluster) is clicked

<b>Date Dimension<b>

Specifies the dimension (or row/column name) in your DataSource, containing the dates associated with your key figures

<b>Keyfigure1 Name<b>

Specifies the dimension (or row/column name) in your DataSource, containing your first key figure

<b>Keyfigure1 (t-1)<b>

This dimensions specification enables users to display the key figure value developments over time. For example:
Actual cost		|	Actual cost (last year)
€1234,56		|	€1000,00
Trends will be displayed by green or red arrows in combination with corresponding percentages next to a clustered marker.

<b>Keyfigure1 Clustering Steps<b>

Specifies the value limits for different display behavior. For example, green (10), yellow or red (500) cluster marker. Example input: ["10","50","100","200","500"]. This is also customizable via CSS.

<b>Keyfigure2 Name<b>

Specifies the dimension (or row/column name) in your DataSource containing your second key figure

<b>Keyfigure2 (t-1)<b>

Works accordingly to Keyfigure1

<b>Keyfigure2 Clustering Steps<b>

Works accordingly to Keyfigure1

<b>Keyfigure Variation Tolerance (%)<b>

Specifies the tolerance (in percentage) used to suppress trend display. Typically users want a 5% discrepancy interval that should be treated as stagnation.

Events
------
<b>On Marker Clicked<b>

This event occurs in case a plain marker (not a clustered one) is clicked. This action opens a message box on the map displaying the data specified in property Marker-Content Dimension and enables you also to handle marker information (for example address, ID, etc.) outside the extension e.g. for further filtering in charts.

<b>On Cluster Clicked<b>

This event works the same way but on the cluster level with the exception that no message box is displayed.

Extensions API
--------------
The following methods are available in SAP Design Studios Script Editor for the extension components.

<b>String getAddress()<b>

Returns address information associated with the last clicked marker. (You should call this one within the event handler for marker clicked.)

<b>String getClusterSelection(String dimension)<b>

Returns the information specified by the method argument dimension (e.g. “Date”) that is associated with the last clicked cluster (you should call this one within the event handler for cluster clicked) as a JSON object.
For example:
{“dimension_name”: [“20140101”,”20140102”,…]}

<b>String getClusterSelectionFilterData(String dimension)<b>

Returns the information (without dimension name, just raw data) specified by the method argument dimension (e.g. “Date”) that is associated with the last clicked cluster (you should call this one within the event handler for cluster clicked) as a JSON object.
For example:
[“20140101”,”20140102”,…]	->	This can be used for chart filtering for instance.

<b>void setCurrentKeyfigureDisplay(String keyFigureName)<b>

Changes the key figure display setting for all of the clusters during runtime. This way you can control programmatically which key figure is shown to the user.

<b>String getCurrentKeyfigureDisplay()<b>

Returns the current key figure name used to display key figures on clusters.

Geo Coding and Geo-Data Persistence
-----------------------------------
Google’s geo coding API can be used for free to a certain degree. In order to lighten workload on your account we have introduced two possible ways to store your geo-referenced data that has been determined by the API at first run. The first approach is by installing an Apache CouchDB instance and pointing the extension to the database URL. Secondly you can use current browser’s internal IndexedDB which sets up a full blown database that is tied to your domain. With IndexedDB, please note that for development purposes, you might need to use a static jetty port, as that is already part of the domain. Otherwise you might set up a database instance with every program execution during SDK development. This is no problem outside the SDK. You could also possibly use a different RESTful and JSON-capable database instead of CouchDB. Just give me a hint if you need further information or assistance on that matter.
How it works (short version)
----------------------------
On first run the app logic will look for key figures and their corresponding description dimensions in the attached DataSource. Setting up all of your markers and clusters will take some time as the geocoder restricts traffic while using the free plan. Persistent storage of your geo data will make sure you don’t call the API more than once for every address entry in your DataSource (see section above).
Any update, for example applying an arbitrary filter, to the underlying DataSource will also be propagated to the extension and impact on your view immediately.

<b>ConVista OpenStreetMap</b>

This extension uses OpenStreetMap (OMS) as map implementation and the Leaflet framework to work with the map itself.
In contrast to Google Maps, OMS enables you to host your own tiles server. That way you can be independent from external resources and even work offline.

<b>ConVista GoogleMap</b>

This extension uses Google Maps as map implementation and the Google Maps JavaScript API v3 to work with the map itself. Google StreetView is also available.

Functionality to display trends in key figure development over time, next to the clusters is not yet implemented. This is only available with OSM right now.

Please note that you shouldn’t use both components at a time in one Dashboard. This is a result of the mechanism that enables us to insert your Google API key at design time as you specified it in the component’s properties. If you can't help it contact me for a quick workaround.

<b>Test data out of the box with custom data source (DS 1.4+ required!)</b>

If you don't have any geo-referencable data ready to display on our maps extensions or you just want to get a quick hands-on, donwload my custom data source <i>MapsExampleDataSource</i> from https://github.com/MartinPankraz/DesignStudioSDK-Components and include it to your project and the maps extensions as usual.

Installation
------------
•	Download the ConVistaMapsExtension.zip ZIP file (you may do this by clicking the Download ZIP button)

•	Click Tools in Design Studio > install Extension to Design Studio…

•	Choose “archive” as installation source (navigate to ZIP file) in Dialogue

•	Accept license and restart Design Studio

•	Have fun using our map extensions (you might need to refresh the project after dropping the maps onto your canvas in Design Studio once)

Meet me at ConVista Infoday or our world renowned carnival (traditional german costume festival) event in Cologne to chat about our Design Studio and Dashboarding ideas :-)

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
