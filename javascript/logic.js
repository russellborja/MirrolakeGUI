//This is to change the contents of the body when clicking 'List' or 'Payload' without refreshing the page
$(document).ready(function(){
	//$('a').bind('click', function(event) { 
	entityComplete();
	$('a').click(function(event){
	  var url = $(this).attr('href');
	  if (url == "formletpublish.html"){
			$("#publish").attr('class', 'active');
			$("#query").attr('class','non-active');
	  }
	  else if(url = "#"){
			$("#publish").attr('class', 'non-active');
			$("#query").attr('class','active');
	  }
	  $('div#container').load(url +  " #container" ); // update container 
	  $('div#results').load(url + " #results"); // update table
	  
	  event.preventDefault(); // stop the browser from following the link
	});
});


//Creates HTTP post/get request when submitting form
function createRequest(entitySend, key,env,from,to,max) {	
  var result = null;
  if (window.XMLHttpRequest) {
    // FireFox, Chrome, etc.
    result = new XMLHttpRequest();
    if (typeof result.overrideMimeType != 'undefined') {
      result.overrideMimeType('text/xml'); // Or anything else
    }
  }
  else if (window.ActiveXObject) {
    // IE
    result = new ActiveXObject("Microsoft.XMLHTTP");
  } 
  else {
  }
  
  //For payload queries
  if (document.getElementById('entityget')){
	//UAT
	if(env == "UAT"){
		//PROD server: http://marsrtlnx1c.nam.nsroot.net:8086/fetch/ml/
		//UAT server: http://marsap1u.nam.nsroot.net:19900/fetch/ml/
		var url = "http://marsap1u.nam.nsroot.net:19900/fetch/ml/" + entitySend + "/" + key;
		result.open("GET", url, true);
		result.send();
	}
	//PROD
	else{
		var url = "http://marsrtlnx1c.nam.nsroot.net:8086/fetch/ml/" + entitySend + "/" + key;
		result.open("GET", url, true);
		result.send();
	}
	
	/*------ Example ------*/
	//Entity: Credit.Price.RT.Bond
	//Key: J7771KGZ4.2SUB1.154453.TKFLOW
	
  }
  
  //For key/metadata list queries
  else{
	//UAT
	if(env == "UAT"){
		result.open("POST", "http://marsap1u.nam.nsroot.net:19900/", true);
	}
	//PROD
	else{
		//result.open("POST", "http://ldnglmwa253565.eur.nsroot.net:8086/", true);
		//DEV server http://marsap1u.nam.nsroot.net:19900/
		//PROD server http://marsrtlnx1c.nam.nsroot.net:8086/
		//UAT http://marsap1u.nam.nsroot.net:19900/
		result.open("POST", "http://marsrtlnx1c.nam.nsroot.net:8086/", true);
	}
		result.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		result.send('{"entity":' + entitySend + ', "from": ' + from + ', "to": ' + to+ ', "max": ' + max + ', "metadata": false, "action": ' + key + ', "user": "browser"}');
		  
		  
		/*------ Example ------*/
		//Entity: Credit.AMC.CustAccount
		//Action: ml-meta
		//From: A 
		//To: ~ 
		//Max: 1
	  
  }
  
  result.onreadystatechange = checkData;
  
  //Parse result
  function checkData(){
	if (result.readyState==4 ){
		//For payload queries
		if (document.getElementById('entityget')){
		var response = result.responseXML;
		var xmlText = new XMLSerializer().serializeToString(response); //convert XML response to string
		var xmlTextNode = document.createTextNode(xmlText);
		var parentDiv = document.getElementById("value");
		parentDiv.appendChild(xmlTextNode);
		}
		
		//For key and metadata list queries
		else{
			var response = result.responseText;
			var obj = eval ("(" + response + ")");
			//if key list
			if(key == '"ml-keys"'){
				var parsedObj = "";
				for(key in obj){
					parsedObj += obj[key] + '<br>';
				}			
				document.getElementById("value").innerHTML=parsedObj;
			}
			//if metadata
			else{
				var metaObj = eval ("(" + response + ")");
				var metaValue = "";
				max = max.substring(1);
				max = max.substring(0,max.length-1);
				var metaMax = parseInt(max);
				
				for (var i=0; i < metaMax; i++){
					var keys = Object.keys(metaObj[i]);
					metaValue += "{" + i + "}:<br>";
					for (var j = 0; j < keys.length; j++){
						metaValue += "&nbsp;&nbsp;&nbsp;&nbsp;" + keys[j] + " : " + metaObj[i][keys[j]] + "<br>";					
					}
					document.getElementById("value").innerHTML = metaValue;
				}
			}
		}
	}
  }
  
 
}

//Function called when submitting HTML form
function formSubmit(){
	//For payload queries
	if (document.getElementById('entityget')){
		var environment = String(document.getElementById('env').value);
		var entity = String(document.getElementById('entityget').value);
		var key = String(document.getElementById('key').value);
		createRequest(entity,key,environment);
		updateTable(entity);
		return false;
	
	}
	//For key/metadata list entries
	else {
		var environment = String(document.getElementById('env').value);
		var entity = String(document.getElementById('entity').value);
		var action = String(document.getElementById('action').value);
		var entitySend = '"' + String(document.getElementById('entity').value) + '"';
		var actionSend = '"' +  String(document.getElementById('action').value) + '"';
		var from = '"' + String(document.getElementById('from').value) + '"';
		var to = '"' + String(document.getElementById('to').value) + '"';
		var max = '"' + String(document.getElementById('max').value) + '"';
		createRequest(entitySend, actionSend,environment, from,to,max);
		updateTable(entity);
		return false;
	}
}

//Updates results table
function updateTable(entity){
		$('#table td.entityvalue').html(entity);
		
}

//Dropdown autocomplete
function entityComplete(){
	var entities = [
		"Credit.AMC.BrokerAccount",
		"Credit.AMC.CDMS.Customer",
		"Credit.AMC.CustAccount","Credit.AMC.FirmAccount",
		"Credit.AMC.ReferenceCodes",
		"Credit.AMC.SalesTrader",
		"Credit.Authorization",
		"Credit.Bond.Dimension",
		"Credit.Cache.EOD.Loan",
		"Credit.Cache.Retail.Position",
		"Credit.ClientContact",
		"Credit.ClientCoverage",
		"Credit.Contact",
		"Credit.Correlation.PA",
		"Credit.Datalink.CusipBucket",
		"Credit.DTCC.Swaps.Commodity",
		"Credit.DTCC.Swaps.Credit",
		"Credit.DTCC.Swaps.Equity",
		"Credit.DTCC.Swaps.Forex",
		"Credit.DTCC.Swaps.Rate",
		"Credit.ETrading.Marketdata",
		"Credit.Factory.Report",
		"Credit.Flash.Risk",
		"Credit.GFCID",
		"Credit.Gollf.Lookup.Data2",
		"Credit.Gollf.Lookup.Data",
		"Credit.GrandParent",
		"Credit.GrandParent.Activity",
		"Credit.Holidays",
		"Credit.LDR.Loan",
		"Credit.LegalVehicle",
		"Credit.MarketData.CurveRelationship",
		"Credit.MarketData.Equity",
		"Credit.MarketData.IndexArb",
		"Credit.MarketData.InstrumentPrice",
		"Credit.MarketData.Resets",
		"Credit.MarketData.RT.BBA",
		"Credit.MarketData.RT.BondPrice.Direct",
		"Credit.MarketData.RT.BondPrice.RMDS",
		"Credit.MarketData.RT.Security",
		"Credit.Marx.BondCurveMapping",
		"Credit.Marx.CdsInstrument",
		"Credit.Marx.CdsInstrument.Secondary",
		"Credit.Marx.CreditVolatility",
		"Credit.Marx.MipIndex",
		"Credit.Marx.MipIndexMapping",
		"Credit.Marx.ReferenceEntity",
		"Credit.Marx.ReferenceObligation",
		"Credit.Offer.RT.BCD",
		"Credit.Order.Limelight",
		"Credit.Order.RT.BCD",
		"Credit.PLC.EOD.FPDS.Bond",
		"Credit.PMC.Price",
		"Credit.Position.EOD.Bond",
		"Credit.Position.EOD.CashCDO",
		"Credit.Position.EOD.Loan",
		"Credit.Position.RT",
		"Credit.Price.EOD.Bond",
		"Credit.Price.EOD.JSDA.Bond",
		"Credit.Price.Generic.Bond",
		"Credit.Price.RT.Bond",
		"Credit.Price.RT.MarketDepth",
		"Credit.Quote.CDXOptions",
		"Credit.Reference.EOD.Agreement",
		"Credit.Reference.EOD.CreditCurve",
		"Credit.Reference.EOD.FX",
		"Credit.Reference.EOD.IRCurve",
		"Credit.Reference.Loan",
		"Credit.Reference.Loan.Amortization",
		"Credit.Reference.RT.BasketSkew",
		"Credit.Reference.RT.CreditCurve",
		"Credit.Risk.CRM",
		"Credit.Risk.CVA",
		"Credit.Risk.EOD",
		"Credit.Risk.EOD.Configurations",
		"Credit.Risk.EOD.FLOW.APAC",
		"Credit.Risk.EOD.FLOW.EMEA",
		"Credit.Risk.EOD.FLOW.NAM",
		"Credit.Risk.EOD.OIS.FLOW.APAC",
		"Credit.Risk.EOD.OIS.FLOW.EMEA",
		"Credit.Risk.EOD.OIS.FLOW.NAM",
		"Credit.Risk.EOD.SC",
		"Credit.Risk.EOM",
		"Credit.Risk.EOY",
		"Credit.Risk.IRS",
		"Credit.Risk.RT",
		"Credit.Risk.RT.EM",
		"Credit.Risk.RT.FLOW.APAC",
		"Credit.Risk.RT.FLOW.EMEA",
		"Credit.Risk.RT.FLOW.NAM",
		"Credit.Risk.SOD",
		"Credit.SalesFavourite",
		"Credit.Scenario.EOD.CashCDO",
		"Credit.SMC.CMO",
		"Credit.SMC.CORP",
		"Credit.SMC.CORP.INDEX",
		"Credit.SMC.EQUITY",
		"Credit.SMC.GOVT",
		"Credit.SMC.LOAN",
		"Credit.SMC.MBS",
		"Credit.SMC.MONEY-MKT",
		"Credit.SMC.MUNI",
		"Credit.SMC.PFD",
		"Credit.SMC.WARRANT",
		"Credit.Statistic",
		"Credit.Tag.MarketData.InstrumentPrice",
		"Credit.Tag.Marx.CdsInstrument",
		"Credit.Tag.Marx.CdsInstrument.Secondary",
		"Credit.Tag.Marx.MipIndex",
		"Credit.Tag.Marx.ReferenceEntity",
		"Credit.Trade.Block.Bond",
		"Credit.Trade.Bond.TPS",
		"Credit.Trade.Bond.TPS.Block",
		"Credit.Trade.CDS.TPS",
		"Credit.Trade.DPS.IDMapping",
		"Credit.Trade.EOD.EM",
		"Credit.Trade.EOD.IdxOptions",
		"Credit.Trade.EOD.Tranche",
		"Credit.Trade.Loan",
		"Credit.Trade.Loan.FacilityTicket",
		"Credit.Trade.RT.CDS",
		"Credit.Trade.RT.EM",
		"Credit.Trade.RT.Mapping",
		"Credit.Trade.RT.Tranche",
		"Credit.Trade.Structured",
		"Credit.User.Business",
		"Credit.Vantage.RFQ",
		"IH.EV",
		"IH.EXCH.ACK",
		"IH.Map",
		"IH.Trade.Bond",
		"IH.Trade.CDS",
		"IH.Washbook"];
		
		var actions = ["ml-meta","ml-keys"];
		
		
	
		if(document.getElementById("entity")){
			$("#entity").autocomplete({
				lookup: entities
			});
			
		}
		else{
			$("#entityget").autocomplete({
				lookup: entities
			});
		}
		
};



