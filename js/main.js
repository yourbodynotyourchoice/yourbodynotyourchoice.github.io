/****** GLOBAL VARIABLES *******/
var mapWidth = 750, mapHeight = 410;
var keyArray = ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];
var Category = ["gradeData", "prohibitedAfter", "counseling", "waitingPeriod", "consentData", "ultrasound"];
var expressed;
var yearExpressed;
var yearExpressedText;
var colorize;
var scale;
var currentColors = [];
var menuWidth = 200, menuHeight = 300;
var otherMenuWidth = 200, otherMenuHeight = 70;
var menuInfoWidth = 250, menuInfoHeight = 100;
var textArray = ["The report card grade, created by NARAL, given to each state based on their policies regarding a woman's choice and access to abortions. ", "States which prohibit abortion at an earlier date than the federal law. ", "States with laws that require biased-counseling to women seeking abortion services. ","States where a woman must wait a designated period of time after counseling before having an abortion. ", "States with laws restricting young women's access to abortion services by mandating parental consent. ", "States where an ultrasound either must be performed, offered, or advised prior to an abortion. ", "Crisis Pregnancy Centers provide counseling but oppose and undermine abortion rights. ", "Abortion Providers provide counseling and do not promote abortion but help women in need of one. "]
var linkArray = ["<a href = '#overview'> We provide an overview of these policies here.</a>", "<a href = '#prohibition'>  What sort of prohibitions?</a>", "<a href = '#counseling'> What constitutes biased-counseling?</a>", "<a href = '#waiting'> Why are waiting periods considered a restriction?</a>", "<a href = '#consent'> Why is parental consent considered a restriction?</a>", "<a href = '#ultrasound'> What are the differences between these laws?</a>", "<a href = '#counseling'> Here's why.</a>"];
var removeCPC;
var removeAbortion;
var joinedJson; //Variable to store the USA json combined with all attribute data

// SET UP ARRAYS FOR CATEGORIES OF EACH VARIABLE
    //Variable array for Overview
    var arrayOverview = [  "F",       
                        "D",       
                        "C",          
                        "B",          
                        "A"   ];     

    //Variable array for Prohibited At
    var arrayProhibited = [ "12 weeks",     
                        "20 weeks",      
                        "22 weeks",      
                        "24 weeks",      
                        "3rd trimester",      
                        "Viability"   ]; 

    //Variable array for Mandated Counseling
    var arrayCounseling = [ "Yes",     
                        "No"   ];  

    //Variable array for Waiting Period
    var arrayWaitingPeriod = [  "72 hours",     
                            "48 hours",      
                            "24 hours",      
                            "18 hours",     
                            "None"   ];  

    //Variable array for Parental Consent
    var arrayConsent = [    "consent",    
                            "notice",      
                            "none"   ];  

    //Variable array for Ultrasound
    var arrayUltrasound = ["Must be performed",      
                        "Must be offered",      
                        "Must be informed",      
                        "none"   ];  

//SET UP COLOR ARRAYS FOR EACH VARIABLE
    //Color array for Overview & Waiting Period
    var colorArrayOverview = [  "#525252",      //F     //72 hours
                            "#737373",      //D     //48 hours
                            "#969696",      //C     //24 hours
                            "#bdbdbd",      //B     //18 hours
                            "#d9d9d9"   ];  //A     //None

    // Color array for Prohibited At
    var colorArrayProhibited = ["#525252",      //12 weeks
                            "#737373",      //20 weeks
                            "#969696",      //22 weeks
                            "#bdbdbd",      //24 weeks
                            "#d9d9d9",      //3rd trimester
                            "#efefef"   ];  //Viability

    // Color array for Mandated Counseling
    var colorArrayCounseling = ["#525252",      //Yes
                            "#d9d9d9"   ];  //No

    // Color array for Parental Consent
    var colorArrayConsent = [   "#525252",      //Consent
                            "#969696",      //Notice
                            "#d9d9d9"   ];  //None

    // Color array for Ultrasound
    var colorArrayUltrasound = ["#525252",      //Must be performed, offer to view
                            "#636363",      //Must be performed
                            "#969696",      //Must be offered
                            "#d9d9d9"   ];  //None

//SET UP VARIABLES FOR COLORSCALE & CHOROPLETH FUNCTIONS
var currentColors = [];
var currentArray = [];

//SET UP VARIABLES FOR TIMELINE
var timelineFeatureArray = [];
var colorizeChart; // colorScale generator for the chart
var chartHeight = 200;
var chartWidth = 882;
var squareWidth = 18;
var squareHeight = 18;
var chartRect;
var margin = {top: 80, right: 20, bottom: 30, left:10};
var rectColor;
var axisHeight = 30;

/*---*******---END OF GLOBAL VARIABLES---*******---*/
//--------------------------------------------------/

//loads everythang
window.onload = initialize();

//changes active state of navbar
$(function(){
    $('.nav li a').on('click', function(e){
        var $thisLi = $(this).parent('li');
        var $ul = $thisLi.parent('ul');

        if (!$thisLi.hasClass('active')){
            $ul.find('li.active').removeClass('active');
                $thisLi.addClass('active');
        }
    })
});//end active navbar function

//start function for website
function initialize(){
    expressed = Category[0];
    yearExpressed = keyArray[keyArray.length-1];
    animateMap(yearExpressed, colorize, yearExpressedText);
    setMap();
    createMenu(arrayOverview, colorArrayOverview, "Grading Scale: ", textArray[0], linkArray[0]);
    createInset();
    $(".Overview").css({'background-color': '#CCCCCC','color': '#333333'});
    //disables buttons on load
    $('.stepBackward').prop('disabled', true);
    $('.play').prop('disabled', true);
    $('.pause').prop('disabled', true);
    $('.stepForward').prop('disabled', true);
}; //End initialize

//creates map
function setMap(){
    var map = d3.select(".map")
        .append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .attr("class", "us-map");
    
    //Create a Albers equal area conic projection
    var projection = d3.geo.albersUsa()
        .scale(900)
        .translate([mapWidth / 2, mapHeight / 2]);
    
    //create svg path generator using the projection
    var path = d3.geo.path()
        .projection(projection);
    
    queue()
        .defer(d3.csv, "data/grades.csv")
        .defer(d3.csv, "data/prohibitedAfter.csv")
        .defer(d3.csv, "data/counseling.csv")
        .defer(d3.csv, "data/waitingPeriod.csv")
        .defer(d3.csv, "data/consent.csv")
        .defer(d3.csv, "data/ultrasound.csv")
        .defer(d3.json, "data/usa.topojson")
        .defer(d3.json, "data/CPCS.geojson")
        .defer(d3.json, "data/AbortionProviders.geojson")
        .await(callback);
    
    //creates menu [overview starts on load]
    drawMenu();
        
    //retrieve and process json file and data
    function callback(error, grade, prohibitedAfter, counseling, waitingPeriod, consent, ultrasound, usa, cpc, abortionprovider){

        //Variable to store the USA json with all attribute data
        joinedJson = topojson.feature(usa, usa.objects.states).features;
        colorize = colorScale(joinedJson);

        //Create an Array with CSV's loaded
        var csvArray = [grade, prohibitedAfter, counseling, waitingPeriod, consent, ultrasound];
        //Names for the overall Label we'd like to assign them
        var attributeNames = ["gradeData", "prohibitedAfter", "counseling", "waitingPeriod", "consentData", "ultrasound"];
        //For each CSV in the array, run the LinkData function
        for (csv in csvArray){
            LinkData(usa, csvArray[csv], attributeNames[csv]);
        };

        function LinkData(topojson, csvData, attribute){
             var jsonStates = usa.objects.states.geometries;

            //loop through the csv and tie it to the json's via the State Abbreviation
             for(var i=0; i<csvData.length; i++){
                var csvState = csvData[i];
                var csvLink = csvState.adm;

                //loop through states and assign the data to the rigth state
                for(var a=0; a<jsonStates.length; a++){

                    //If postal code = link, we good
                    if (jsonStates[a].properties.postal == csvLink){
                        attrObj = {};

                        //one more loop to assign key/value pairs to json object
                        for(var key in keyArray){
                            var attr = keyArray[key];
                            var val = (csvState[attr]);
                            attrObj[attr] = val;
                        };

                    jsonStates[a].properties[attribute] = attrObj;
                    break;
                    };
                };
             }; 
        }; //END linkData

        //Style the states to be styled according to the data
        var states = map.selectAll(".states")
            .data(joinedJson)
            .enter()
            .append("path")
            .attr("class", function(d){ 
                return "states " + d.properties.postal;
            })
            .style("fill", function(d){
                return choropleth(d, colorize);
            })
            .attr("d", function(d) {
                return path(d);
            })
            .on("mouseover", highlight)
            .on("mouseout", dehighlight);

        var statesColor = states.append("desc")
            .text(function(d) {
                return choropleth(d, colorize);
            })

        //data stuff for overlay
        var cpcCount = [];
        for (var a = 0; a < cpc.features.length; a++){
            var cpc_count = cpc.features[a].properties.Count;
            cpcCount.push(Number(cpc_count));
        }
        
        //creates min and max of cpcs
        var cpcMin = Math.min.apply(Math, cpcCount);
        var cpcMax = Math.max.apply(Math, cpcCount);

        //creates radius for CPC
        var cpcRadius = d3.scale.sqrt()
            .domain([cpcMin, cpcMax])
            .range([2, 20]);
        
        //for abortion provider
        var abortionCount = [];
        for (var b = 0; b < abortionprovider.features.length; b++){
            var abortion_count = abortionprovider.features[b].properties.Count;
            abortionCount.push(Number(abortion_count));
        }
        
        //creates min and max of abortion providers
        var abortionMin = Math.min.apply(Math, abortionCount);
        var abortionMax = Math.max.apply(Math, abortionCount);
        
        //creates radius 
        var abortionRadius = d3.scale.sqrt()
            .domain([abortionMin, abortionMax])
            .range([2, 23]);

        changeAttribute(yearExpressed, colorize);
        overlay(path, cpcRadius, abortionRadius, map, cpc, abortionprovider);
    }; //END callback
}; //END setmap

//menu items function
function drawMenu(){
    //click changes on Overview
    $(".Overview").click(function(){ 
        expressed = Category[0];
        yearExpressed = keyArray[keyArray.length-1];
        d3.selectAll(".yearExpressedText").remove();
        drawMenuInfo(colorize, yearExpressed);
        $('.stepBackward').prop('disabled', true);
        $('.play').prop('disabled', true);
        $('.pause').prop('disabled', true);
        $('.stepForward').prop('disabled', true);
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayOverview, colorArrayOverview, "Grading Scale: ", textArray[0], linkArray[0]);
        $(".Overview").css({'background-color': '#CCCCCC','color': '#333333'});
        //removes chart
        var oldChart = d3.selectAll(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
    });
    
    //click changes for Prohibited At
     $(".Prohibited").click(function(){ 
        expressed = Category[1];
        $('.stepBackward').prop('disabled', false);
        $('.play').prop('disabled', false);
        $('.pause').prop('disabled', false);
        $('.stepForward').prop('disabled', false);
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayProhibited, colorArrayProhibited, "Prohibited At: ", textArray[1], linkArray[1]);
        $(".Prohibited").css({'background-color': '#CCCCCC','color': '#333333'});
        //removes and creates correct chart
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart(yearExpressed);
     });
    
    //click changes for mandated counseling
    $(".Counseling").click(function(){  
        expressed = Category[2];
        $('.stepBackward').prop('disabled', false);
        $('.play').prop('disabled', false);
        $('.pause').prop('disabled', false);
        $('.stepForward').prop('disabled', false);
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayCounseling, colorArrayCounseling, "Mandated Counseling: ", textArray[2], linkArray[2]);
        $(".Counseling").css({'background-color': '#CCCCCC','color': '#333333'});
        //removes and creates correct chart
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart(yearExpressed);
        });
    
    //click changes for waiting period
    $(".Waiting").click(function(){ 
        expressed = Category[3];
        $('.stepBackward').prop('disabled', false);
        $('.play').prop('disabled', false);
        $('.pause').prop('disabled', false);
        $('.stepForward').prop('disabled', false);
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayWaitingPeriod, colorArrayOverview, "Waiting Period: ", textArray[3], linkArray[3]);
        $(".Waiting").css({'background-color': '#CCCCCC','color': '#333333'});
        //removes and creates correct chart
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart(yearExpressed);
        });
    
    //click changes for parental consent
    $(".Parental").click(function(){  
        expressed = Category[4];
         $('.stepBackward').prop('disabled', false);
         $('.play').prop('disabled', false);
         $('.pause').prop('disabled', false);
         $('.stepForward').prop('disabled', false);
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayConsent, colorArrayConsent, "Parental Consent: ", textArray[4], linkArray[4])
        $(".Parental").css({'background-color': '#CCCCCC','color': '#333333'});
        //removes and creates correct chart
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart(yearExpressed);
});
    
    //click changes for mandatory ultrasound
    $(".Ultrasound").click(function(){
        expressed = Category[5];
        $('.stepBackward').prop('disabled', false);
         $('.play').prop('disabled', false);
         $('.pause').prop('disabled', false);
         $('.stepForward').prop('disabled', false);
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayUltrasound, colorArrayUltrasound, "Mandatory Ultrasound: ", textArray[5], linkArray[5]);
        $(".Ultrasound").css({'background-color': '#CCCCCC','color': '#333333'});
        //removes and creates correct chart
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart(yearExpressed);
});
}; //END drawMenu

//creates dropdown menu
function drawMenuInfo(colorize, yearExpressed){
    //creates year for map menu
    yearExpressedText = d3.select(".menu-info")
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "yearExpressedText menu-info")
        .text(yearExpressed)
        .style({'font-size':'36px', 'font-weight': 'strong'}); 
}; //End DrawMenuInfo

//vcr controls click events
function animateMap(yearExpressed, colorize, yearExpressedText){
    //step backward functionality
    $(".stepBackward").click(function(){
        if (yearExpressed <= keyArray[keyArray.length-1] && yearExpressed > keyArray[0]){
            yearExpressed--;
            changeAttribute(yearExpressed, colorize);
        } else {
            yearExpressed = keyArray[keyArray.length-1];
            changeAttribute(yearExpressed, colorize);
        }; 
    });
    //play functionality
    $(".play").click(function(){
        timer.play();
        $('.play').prop('disabled', true);
    });
    //pause functionality
    $(".pause").click(function(){
        timer.pause();
        $('.play').prop('disabled', false);
        changeAttribute(yearExpressed, colorize);
    });
    //step forward functionality
    $(".stepForward").click(function(){
        if (yearExpressed < keyArray[keyArray.length-1]){
            yearExpressed++;
            changeAttribute(yearExpressed, colorize);
        } else {
            yearExpressed = keyArray[0];
            changeAttribute(yearExpressed, colorize);
        }; 
    });
}; //end AnimateMAP

//for play functionality
function timeMapSequence(yearsExpressed) {
    changeAttribute(yearExpressed, colorize);
    if (yearsExpressed < keyArray[keyArray.length-1]){
        yearExpressed++; 
    };
}; //end timeMapSequence

//changes year displayed on map
function changeAttribute(year, colorize){
    var removeOldYear = d3.selectAll(".yearExpressedText").remove();
    
    for (x = 0; x < keyArray.length; x++){
        if (year == keyArray[x]) {
             yearExpressed = keyArray[x];
        }
    }
    //colorizes state
    d3.selectAll(".states")
        .style("fill", function(year){
            return choropleth(year, colorize);
        })
        .select("desc")
            .text(function(d) {
                return choropleth(d, colorize);
        });
     //alters timeline year text    
    var timelineYear = d3.select(".timeline")
        .selectAll('g')
        .attr("font-weight", function(d){
            if (year == d.getFullYear()){
                return "bold";
            } else {
                return "normal";
            }
        }).attr("font-size", function(d){
            if (year == d.getFullYear()){
                return "18px";
            } else {
                return "12px";
            }
        }).attr("stroke", function(d){
            if (year == d.getFullYear()){
                return "#986cb3";
            } else {
                return "gray";
            }
         });
    drawMenuInfo(colorize, year);
}; //END changeAttribute


//creates the menu items 
function createMenu(arrayX, arrayY, title, infotext, infolink){
    var yArray = [40, 85, 130, 175, 220, 265];
    var oldItems = d3.selectAll(".menuBox").remove();
    var oldItems2 = d3.selectAll(".menuInfoBox").remove();
    
    //creates menuBoxes
    menuBox = d3.select(".menu-inset")
            .append("svg")
            .attr("width", menuWidth)
            .attr("height", menuHeight)
            .attr("class", "menuBox");
    
    //creates Menu Title
    var menuTitle = menuBox.append("text")
        .attr("x", 10)
        .attr("y", 30)
        .attr("class","title")
        .text(title)
        .style("font-size", '16px');
    
    //draws and shades boxes for menu
    for (b = 0; b < arrayX.length; b++){  
       var menuItems = menuBox.selectAll(".items")
            .data(arrayX)
            .enter()
            .append("rect")
            .attr("class", "items")
            .attr("width", 35)
            .attr("height", 35)
            .attr("x", 15);
        
        menuItems.data(yArray)
            .attr("y", function(d, i){
                return d;
            });
        
        menuItems.data(arrayY)
            .attr("fill", function(d, i){ 
                return arrayY[i];
            });
    };
    //creates menulabels
    var menuLabels = menuBox.selectAll(".menuLabels")
        .data(arrayX)
        .enter()
        .append("text")
        .attr("class", "menuLabels")
        .attr("x", 60)
        .text(function(d, i){
            for (var c = 0; c < arrayX.length; c++){
                return arrayX[i]
            }
        })
        .style({'font-size': '14px', 'font-family': 'Open Sans, sans-serif'});
    
        menuLabels.data(yArray)
            .attr("y", function(d, i){
                return d + 30;
            });
    
     //creates menuBoxes
    menuInfoBox = d3.select(".menu-info")
        .append("div")
        .attr("width", menuInfoWidth)
        .attr("height", menuInfoHeight)
        .attr("class", "menuInfoBox textBox")
        .html(infotext + infolink);
}; //end createMenu

//creates proportional symbol overlay with click events
function overlay(path, cpcRadius, abortionRadius, map, cpc, abortionprovider){
    $(".cpc-section").click(function(){
        var cpcDiv = document.getElementById('cpc-centers');
        var cpcInsetDiv = document.getElementById('cpc-inset');
        if (d3.selectAll(".cpcLocations")[0].length > 0){
            removeCPC = d3.selectAll(".cpcLocations").remove();
            removeCPCInfo = d3.selectAll(".cpcMenuInfoBox").remove();
            cpcInsetDiv.style.visibility = "hidden";
        } else {
            cpcPoints(map, cpc, path, cpcRadius);
            cpcInsetDiv.style.visibility = "visible";
        }
    });
    
    $(".abortion-section").click(function(){  
        var abortionDiv = document.getElementById('abortion-centers');
        var insetDiv = document.getElementById('abortion-inset');
        if (d3.selectAll(".abortionLocations")[0].length > 0){
            removeAbortion = d3.selectAll(".abortionLocations").remove();
            removeAbortionInfo = d3.selectAll(".abortionMenuInfoBox").remove();
            insetDiv.style.visibility = "hidden";
        } else {
            abortionPoints(map, abortionprovider, path, abortionRadius);
            insetDiv.style.visibility = "visible";
        }
    }); 
}; //END overlay function

//creates cpc point data
function cpcPoints(map, cpc, path, cpcRadius){
    //adds cpc locations
    map.selectAll(".cpcLocations")
        .data(cpc.features)
        .enter()
        .append("path")
        .attr("class", "cpcLocations")
        .attr('d', path.pointRadius(function(d){
            return cpcRadius(d.properties.Count);
        }));   
    
    //creates menuBoxes
    var menuInfoBox = d3.select(".sequence-buttons")
        .append("div")
        .attr("width", menuInfoWidth)
        .attr("height", menuInfoHeight)
        .attr("class", "cpcMenuInfoBox")
        .html(textArray[6] + linkArray[6]);
}; //end cpcPoints

//creates abortion providers point data
function abortionPoints(map, abortionprovider, path, abortionRadius){
    //adds abortion provider locations
    map.selectAll(".abortionLocations")
        .data(abortionprovider.features)
        .enter()
        .append("path")
        .attr("class", "abortionLocations")
        .attr('d', path.pointRadius(function(d){
            return abortionRadius(d.properties.Count);
        }));
    
    //creates menuBoxes
    var menuInfoBox = d3.select(".sequence-buttons")
        .append("div")
        .attr("width", menuInfoWidth)
        .attr("height", menuInfoHeight)
        .attr("class", "abortionMenuInfoBox")
        .text(textArray[7]);
}; //end abortionPoints

//creates proportional symbol legend
function createInset() {
    var oldItems3 = d3.selectAll(".cpcCircles").remove();
    var oldItems4 = d3.selectAll(".abortionCircles").remove();
    var cpcRadiusArray = [2, 11.85, 20];
    var cpcLabelArray = [1, 4, 8];
    var abortionRadiusArray = [2, 16.23, 23];
    var abortionLabelArray = [1, 6, 11];
    
    //creates menuBoxes
    cpcMenuBox = d3.select(".cpc-inset")
            .append("svg")
            .attr("width", otherMenuWidth)
            .attr("height", otherMenuHeight)
            .attr("class", "cpcmenuBox");
    
    //draws and shades circles for menu
   var cpcCircles = cpcMenuBox.selectAll(".cpcCircles")
        .data(cpcRadiusArray)
        .enter()
        .append("circle")
        .attr("cy", 30)
        .attr("cx", function(d, i){
            return (1*d)+(i*50)+10;
        })
        .attr("r", function(d, i){
            return d;
        })
        .attr("class", "cpcCircles")
        .style({'fill': '#FA6E39','fill-opacity': '0.7'});  
    
    //labels cpc circles
    var cpcLabels = cpcMenuBox.selectAll(".cpcOverlayLabels")
        .data(cpcLabelArray)
        .enter()
        .append("text")
        .attr("class", "cpcOverlayLabels")
        .attr("y", 35)
        .text(function(d, i){
            for (var k = 0; k < cpcLabelArray.length; k++){
                return cpcLabelArray[i]
            }
        })
        .style({'font-size': '14px', 'font-family': 'Open Sans, sans-serif'});
    
        cpcLabels.data(cpcRadiusArray)
            .attr("x", function(d, i){
                return (2*d)+(i*50)+15;
            });
    //creates abortion info inset
    abortionMenuBox = d3.select(".abortion-inset")
        .append("svg")
        .attr("width", otherMenuWidth)
        .attr("height", otherMenuHeight)
        .attr("class", "abortionMenuBox");
    
     //draws and shades circles for menu
    var abortionCircles = abortionMenuBox.selectAll(".abortionCircles")
        .data(abortionRadiusArray)
        .enter()
        .append("circle")
        .attr("cy", 30)
        .attr("cx", function(d, i){
            return (1*d)+(i*50)+10;
        })
        .attr("r", function(d, i){
            return d;
        })
        .attr("class", "abortionCircles")
        .style({'fill': '#37C4AB','fill-opacity': '0.7'}); 
    
    //labels abortion circles
    var abortionLabels = abortionMenuBox.selectAll(".abortionOverlayLabels")
        .data(abortionLabelArray)
        .enter()
        .append("text")
        .attr("class", "abortionOverlayLabels")
        .attr("y", 35)
        .text(function(d, i){
            for (var k = 0; k < abortionLabelArray.length; k++){
                return abortionLabelArray[i]
            }
        })
        .style({'font-size': '14px', 'font-family': 'Open Sans, sans-serif'});
    
        abortionLabels.data(abortionRadiusArray)
            .attr("x", function(d, i){
                return (2*d)+(i*50)+15;
            });  
}; //END create inset

//---------------------------------------------//
/* BEAUTIFUL GREYSCALE RAINBOW COLOR GENERATOR */
//---------------------------------------------//
//SET UP COLOR ARRAYS FOR MAP
function colorScale(data){
// this if/else statement determines which variable is currently being expressed and assigns the appropriate color scheme to currentColors
    if (expressed === "gradeData") {   
        currentColors = colorArrayOverview;
        currentArray = arrayOverview;
    } else if (expressed === "consentData") {
        currentColors = colorArrayConsent;
        currentArray = arrayConsent;
    } else if (expressed === "prohibitedAfter") {
        currentColors = colorArrayProhibited;
        currentArray = arrayProhibited;
    } else if (expressed === "counseling") {
        currentColors = colorArrayCounseling;
        currentArray = arrayCounseling;
    } else if (expressed === "waitingPeriod") {
         currentColors = colorArrayOverview;
         currentArray = arrayWaitingPeriod;
    } else if (expressed === "ultrasound") {
        currentColors = colorArrayUltrasound;
        currentArray = arrayUltrasound;
    };

    scale = d3.scale.ordinal()
                .range(currentColors)
                .domain(currentArray); //sets the range of colors and domain of values based on the currently selected 
    return scale(data[yearExpressed]);
};
//Sets up color scale for chart
function colorScaleChart(data) {
    if (expressed === "gradeData") {   
        currentColors = colorArrayOverview;
        currentArray = arrayOverview;
    } else if (expressed === "consentData") {
        currentColors = colorArrayConsent;
        currentArray = arrayConsent;
    } else if (expressed === "prohibitedAfter") {
        currentColors = colorArrayProhibited;
        currentArray = arrayProhibited;
    } else if (expressed === "counseling") {
        currentColors = colorArrayCounseling;
        currentArray = arrayCounseling;
    } else if (expressed === "waitingPeriod") {
         currentColors = colorArrayOverview;
         currentArray = arrayWaitingPeriod;
    } else if (expressed === "ultrasound") {
        currentColors = colorArrayUltrasound;
        currentArray = arrayUltrasound;
    };

    scale = d3.scale.ordinal()
                .range(currentColors)
                .domain(currentArray); 

    return scale(data);
}; //end Colorscale

function choropleth(d, colorize){
    var data = d.properties ? d.properties[expressed] : d;
    return colorScale(data);
};

function choroplethChart(d, colorize) {
    return colorScaleChart(d);
};

//---------------------------------------------//
/*              START CHART FUNCTIONS          */
//---------------------------------------------//
// Robin's section

// setChart function sets up the timeline chart and calls the updateChart function
function setChart(yearExpressed) {
    // reset the timelineFeatureArray each time setChart is called
    timelineFeatureArray = []; //this will hold the new feature objects that will include a value for which year a law changed
    // colorize is different for the chart since some states have more than one law
    colorizeChart = colorScaleChart(timelineFeatureArray);

    //initial setup of chart
    var chart = d3.select(".graph")
        .append("svg")
        .attr("width", chartWidth+"px")
        .attr("height", chartHeight+"px")
        .attr("class", "chart");
        
    //put all rects in a g element
    var squareContainer = chart.append("g")
        .attr("transform", "translate(" + margin.left + ', ' + margin.top + ')');

    //for-loop creates an array of feature objects that stores three values: thisYear (for the year that a law was implemented), newLaw (the categorization of the new policy) and a feature object (the state that the law changed in)
    for (var feature in joinedJson) {
        var featureObject = joinedJson[feature];
        for (var thisYear = 1; thisYear<=keyArray.length-1; thisYear++){
            var lastYear = thisYear - 1;
            if (featureObject.properties[expressed][keyArray[thisYear]] != featureObject.properties[expressed][keyArray[lastYear]]) { //have to account for the value not being undefined since the grade data is part of the linked data, and that's not relevant for the timeline
                timelineFeatureArray.push({yearChanged: Number(keyArray[thisYear]), newLaw: featureObject.properties[expressed][keyArray[thisYear]], feature: featureObject}); //each time a law is passed in a given year, a new feature object is pushed to the timelineFeatureArray
            };
        };
    };
    var yearObjectArray = []; //will hold a count for how many features should be drawn for each year, the following for-loop does that

    //for-loop determines how many rects will be drawn for each year
    for (key in keyArray) {
        var yearCount = 1;
        for (i = 0; i < timelineFeatureArray.length; i++) {
            //loop through here to see which year it matches and up
            if (timelineFeatureArray[i].yearChanged == keyArray[key]) {
                //countYears++;
                yearObjectArray.push({"year": Number(keyArray[key]), "count":yearCount});
                yearCount = yearCount++;
            };
        };   
    };

    //attach data to the rects and start drawing them
    chartRect = squareContainer.selectAll(".chartRect")
        .data(timelineFeatureArray) //use data from the timelineFeatureArray, which holds all of the states that had some change in law 
        .enter()
        .append("rect") //create a rectangle for each state
        .attr("class", function(d) {
            return "chartRect " + d.feature.properties.postal;
        })
        .attr("width", squareWidth+"px")
        .attr("height", squareHeight+"px");
    
    //determine the x-scale for the rects, determing where along the x-axis they will be drawn according to which year the law changed
    var x = d3.scale.linear()
        .domain([keyArray[0], keyArray[keyArray.length-1]]) //domain is an array of 2 values: the first and last years in the keyArray (1973 and 2014)
        .rangeRound([0, chartWidth - margin.left - margin.right]); //range determines the x value of the square; it is an array of 2 values: the furthest left x value and the furthest right x value (on the screen)

    //set a time scale for drawing the axis; use a separate time scale rather than a linear scale for formatting purposes.
    var timeScale = d3.time.scale()
        .domain([new Date(keyArray[1]), d3.time.year.offset(new Date(keyArray[keyArray.length-1]), 1)]) //domain is an array of 2 values: the first and last years in the keyArray (1973 and 2014)
        .rangeRound([0, chartWidth - margin.left - margin.right]); //range determines the x value of the square; it is an array of 2 values: the furthest left x value and the furthest right x value (on the screen)

    //place the rects on the chart
    var rectStyle = chartRect.attr("transform", function(d) {
            return "translate(" + x(d.yearChanged) + ")"; //this moves the rect along the x axis according to the scale, depending on the corresponding year that the law changed
        })
        //y-value determined by how many rects are being drawn for each year
        .attr("y", function(d,i) {
            var yValue = 0;
            for (i = 0; i < yearObjectArray.length; i++) {
                if (yearObjectArray[i].year == d.yearChanged) {
                    yValue = yearObjectArray[i].count*(squareHeight+1);
                    yearObjectArray[i].count-=1;
                };
            };
            return yValue;
        })
        .style("fill", function(d) {
            return choroplethChart(d.newLaw, colorize); //apply the color according to what the new law is in that year
        })
        .on("mouseover", highlightChart)
        .on("mouseout", dehighlight);

    //save text description of the color applied to each rect to be able to use this for dehighlight
    rectColor = rectStyle.append("desc")
            .text(function(d) {
                return choroplethChart(d.newLaw, colorize);
            })
            .attr("class", "rectColor");

    //Creates the axis function
    var axis = d3.svg.axis()
        .scale(timeScale)
        .orient("bottom")
        .ticks(d3.time.years, 1)
        .tickFormat(d3.time.format('%y'))
        .tickPadding(5) //distance between axis line and labels
        .innerTickSize(50);

    //sets the thickness of the line between the ticks and the corresponding squares in the chart
    var timelineLine = axis.tickSize(1);

    //sets the margins for the timeline transform
    var timelineMargin = {top: 50, right: 20, bottom: 30, left:40};

    //draw the timeline as a g element on the chart
    var timeline = chart.append("g")
        .attr("height", chartHeight)
        .attr("width", chartWidth)
        .attr('transform', 'translate(' + timelineMargin.left + ',' + (chartHeight - timelineMargin.top - timelineMargin.bottom) + ')') //set the starting x,y coordinates for where the axis will be drawn
        .attr("class", "timeline")
        .call(axis); //calls the axis function on the timeline
    
    //adds mouse events
    timeline.selectAll('g') 
        .each(function(d){
            d3.select(this)
             .on("mouseover", function(){
                 d3.select(this)
                    .attr("font-weight", "bold")
                    .attr("cursor", "pointer")
                    .attr("font-size", "18px")
                    .attr("stroke", "#986cb3");
            })
            .on("mouseout", function(){
                    d3.select(this)
                        .attr("font-weight", "normal")
                        .attr("font-size", "12px")
                        .attr("stroke", "gray")
                        .attr("cursor", "pointer");
            })
            .on("click", function(){
                 d3.select(this)
                    .attr("font-weight", "bold")
                    .attr("cursor", "pointer")
                    .attr("font-size", "18px")
                    .attr("stroke", "#986cb3");
                var year = d.getFullYear();
                changeAttribute(year, colorize);
                animateMap(year, colorize, yearExpressedText);
            });
        });
};

/* ------------END CHART FUNCTIONS------------ */


//---------------------------------------------//
/*       START HIGHLIGHT & LABEL FUNCTIONS     */
//---------------------------------------------//
// Robin's section
//Highlighting for the map
function highlight(data) {
    //holds the currently highlighted feature
    var feature = data.properties ? data.properties : data.feature.properties;
    d3.selectAll("."+feature.postal)
        .style("fill", "#8856A7");

    //set the state name as the label title
    var labelName = feature.name;
    var labelAttribute;

    //set up the text for the dynamic labels for the map
    //labels should match the yearExpressed and the state of the law during that year
    if (expressed == "gradeData") {
        labelAttribute = "Report Card: "+feature[expressed][Number(yearExpressed)];
    } else if (expressed == "prohibitedAfter") {
        labelAttribute = yearExpressed+"<br>Prohibited at "+feature[expressed][Number(yearExpressed)];
    } else if (expressed == "counseling") {
        if (feature[expressed][Number(yearExpressed)] == "Yes") {
            labelAttribute = yearExpressed+"<br>"+"Pre-abortion counseling mandated by law";
        } else if (feature[expressed][Number(yearExpressed)] == "No") {
            labelAttribute = yearExpressed+"<br>"+"No mandated counseling";
        };
    } else if (expressed == "waitingPeriod") {
        if (feature[expressed][Number(yearExpressed)] == "None") {
            labelAttribute = yearExpressed+"<br>No mandated waiting period";
        } else {
            labelAttribute = yearExpressed+"<br>Mandated waiting period: "+feature[expressed][Number(yearExpressed)];
        };
    } else if (expressed == "consentData") {
        if (feature[expressed][Number(yearExpressed)] == "none") {
            labelAttribute = yearExpressed+"<br>No law requiring parental consent for minors";
        } else if (feature[expressed][Number(yearExpressed)] == "notice") {
            labelAttribute = yearExpressed+"<br>Minor must notify parents about an abortion";
        } else if (feature[expressed][Number(yearExpressed)] == "consent") {
            labelAttribute = yearExpressed+"<br>Minor's parents must give consent before abortion can be performed";
        };
    } else if (expressed == "ultrasound") {
        if (feature[expressed][Number(yearExpressed)] == "none") {
        labelAttribute = yearExpressed+"<br>No mandatory ultrasound law";
        } else {
            labelAttribute = yearExpressed+"<br>"+feature[expressed][Number(yearExpressed)];
        }
    }

    var infoLabel = d3.select(".map")
        .append("div")
        .attr("class", "infoLabel")
        .attr("id",feature.postal+"label")
        .attr("padding-left", 500+"px");

    var labelTitle = d3.select(".infoLabel")
        .html(labelName)
        .attr("class", "labelTitle");

    var labelAttribute = d3.select(".labelTitle")
        .append("div")
        .html(labelAttribute)
        .attr("class", "labelAttribute")
};

//Function for highlighting the chart
function highlightChart(data) {
    //holds the currently highlighted feature
    var feature = data.properties ? data.properties : data.feature.properties;
    d3.selectAll("."+feature.postal)
        .style("fill", "#8856A7");

    //set the state name as the label title
    var labelName = feature.name;
    var labelAttribute;

    //set up the text for the dynamic labels
    //when highlighting the chart, the labels reflect the year the law changed and the law that was changed that year, regardless of which year is being shown on the map
    if (expressed == "prohibitedAfter") {
        labelAttribute = data.yearChanged+"<br>Prohibited at "+data.newLaw;
    } else if (expressed == "counseling") {
        if (data.newLaw == "Yes") {
            labelAttribute = data.yearChanged+"<br>"+"Pre-abortion counseling mandated by law";
        } else if (data.newLaw == "No") {
            labelAttribute = data.yearChanged+"<br>"+"No mandated counseling";
        };
    } else if (expressed == "waitingPeriod") {
        if (data.newLaw == "None") {
            labelAttribute = data.yearChanged+"<br>No mandated waiting period";
        } else {
            labelAttribute = data.yearChanged+"<br>Mandated waiting period: "+data.newLaw;
        };
    } else if (expressed == "consentData") {
        if (data.newLaw == "none") {
            labelAttribute = data.yearChanged+"<br>No law requiring parental consent for minors";
        } else if (data.newLaw == "notice") {
            labelAttribute = data.yearChanged+"<br>Minor must notify parents about an abortion";
        } else if (data.newLaw == "consent") {
            labelAttribute = data.yearChanged+"<br>Minor's parents must give consent before abortion can be performed";
        };
    } else if (expressed == "ultrasound") {
        if (data.newLaw == "none") {
        labelAttribute = data.yearChanged+"<br>No mandatory ultrasound law";
        } else {
            labelAttribute = data.yearChanged+"<br>"+data.newLaw;
        }
    }

    var infoLabel = d3.select(".map")
        .append("div")
        .attr("class", "infoLabel")
        .attr("id",feature.postal+"label")
        .attr("padding-left", 500+"px");

    var labelTitle = d3.select(".infoLabel")
        .html(labelName)
        .attr("class", "labelTitle");

    var labelAttribute = d3.select(".labelTitle")
        .append("div")
        .html(labelAttribute)
        .attr("class", "labelAttribute")
};

//Dehlighting for the map & chart
function dehighlight(data) {
    var feature = data.properties ? data.properties : data.feature.properties;

    var deselect = d3.selectAll("#"+feature.postal+"label").remove();

    //dehighlighting the states
    var selection = d3.selectAll("."+feature.postal)
        .filter(".states");    
    var fillColor = selection.select("desc").text();
    selection.style("fill", fillColor);

    //dehighlighting the chart
    //there is a small bug in here for states that have 2 laws passed during different years, will fix later
    var chartSelection = d3.selectAll("."+feature.postal)
        .filter(".chartRect");
    var chartFillColor = chartSelection.select("desc").text();
    chartSelection.style("fill", chartFillColor);

};

// jQuery timer for play/pause
var timer = $.timer(function() {
        if (yearExpressed == keyArray[keyArray.length-1]){
            yearExpressed = keyArray[0];
        };
        animateMap(yearExpressed, colorize, yearExpressedText);
        timeMapSequence(yearExpressed);  
	});
timer.set({ time : 800, autostart : false });