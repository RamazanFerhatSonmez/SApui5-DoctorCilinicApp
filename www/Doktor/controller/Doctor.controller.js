sap.ui.define(["sap/ui/core/mvc/Controller",],
	function(Controller) {
		"use strict";
		var _this;
		var oData;
		var dataBase;
		var doctorID;
		var sPath;
		var doctor_Count;
		return Controller.extend("newProject.Doktor.controller.Doctor", {
			onInit:function(){
				_this = this;
				doctor_Count=0;
				oModel.setProperty("/doctorCountModel", "");
				var modelDoc2={
					"Modeldoctortitle2":[
					{ titleId:"1",doktorTitle: "Pratisyen Doktor"},
					{ titleId:"2",doktorTitle: "Uzman Doktor"},
					{ titleId:"3",doktorTitle: "Operator Doktor"},
					{ titleId:"4",doktorTitle: "Yardımcı Doçent"},
					{ titleId:"5",doktorTitle: "Doçent"},
					{ titleId:"6",doktorTitle: "Profesör"},
					{ titleId:"7",doktorTitle: "Ordinaryus"}
					]
				};
				oModel.setData(modelDoc2);
				if (window.openDatabase) {
					dataBase = openDatabase('DoctorHastaApp', '1.0', 'Web SQL Veritabanı', 15*1024*1024);  
				}else{
					alert("Maalesef tarayıcınızda Web SQL desteği bulunmamaktadır.");
				}	
				var doctorListArray = [];
				dataBase.transaction(function(tx) {
					tx.executeSql('SELECT * FROM doctorTable ', [],function(islem, sonuc) {
						console.log(sonuc.rows);
						jQuery.each(sonuc.rows, function(index, value) {
							doctorListArray.push(value);	
							doctor_Count+=1;						
							// oModel.oData.DoctorList.push({
							// 	"doctorModelName" : value.doctorAd,
							// 	"doctorModelTitle" : value.doctorUnvan,
							// });
						});
						oModel.setProperty("/DoctorList",doctorListArray);
					});
				})
				dataBase.transaction(function (tx) {
					tx.executeSql('SELECT COUNT(*) AS c FROM doctorTable', [], function (tx, r) {
						console.log( r.rows.item(0).c);
						oModel.setProperty("/doctorCountModel",r.rows.item(0).c);						
					}, function (tx, e) {
						alert ("unknown: " + e.message);
					});
				});
			},
			addEditDoctor:function(oEvent){
				_this=this;
				if(!_this.addDoctorDialog){
					_this.addDoctorDialog = sap.ui.xmlfragment("newProject.Doktor.fragments.doctorDialog", this);
				}
				_this.addDoctorDialog.open();				
			},
			deleteDoctor: function (oEvent){
				oData = oModel.getData().DoctorList;
				sPath = oEvent.getSource().getBindingContext().getPath();
				//alert(sPath);
				var doctorList=oModel.getProperty(sPath);
				//alert("ID:"+doctorList.id+" Name:"+doctorList.doctorAd+" Unvan:"+doctorList.doctorUnvan);	
				dataBase.transaction(function(tx) {
					tx.executeSql('DELETE FROM doctorTable WHERE id = ?', [doctorList.id], function(islem, sonuc){
					});
					tx.executeSql('DELETE FROM hastaTable WHERE doctorPatientId = ?', [doctorList.id], function(islem, sonuc){
					});
				});
				var iLength = sPath.length;
				var idIndex = sPath.slice(iLength - 1);
				var removed = oData.splice(idIndex, 1);
				oModel.refresh();
			},
			addDoctorDialogClose:function(oEvent){
				_this.addDoctorDialog.close();
				_this.addUpdateDoctorDialog.destroy(true);
			},
			addDoctorToDB: function(oEvent){
				var dialogDoctorName = sap.ui.getCore().byId("idAddDoctorName").getValue();
				dialogDoctorName +=" "+sap.ui.getCore().byId("idAddDoctorSurname").getValue();
				var dialogDoctorTitle = sap.ui.getCore().byId("idAddDoctorUnvan").getValue();
				dataBase.transaction(function(tx2) {
					tx2.executeSql('INSERT INTO doctorTable(doctorAd,doctorUnvan) VALUES (?,?)',[dialogDoctorName,dialogDoctorTitle]);  
				});	
				_this.getDoctorList();  
				_this.addDoctorDialog.close();
			},
			getDoctorList:function(){
				var doctorListArray = [];
				dataBase.transaction(function(tx) {
					tx.executeSql('SELECT * FROM doctorTable ', [],function(islem, sonuc) {
						console.log(sonuc.rows);
						jQuery.each(sonuc.rows, function(index, value) {
							doctorListArray.push(value);							
							// oModel.oData.DoctorList.push({
							// 	"doctorModelName" : value.doctorAd,
							// 	"doctorModelTitle" : value.doctorUnvan,
							// });
						});
						oModel.setProperty("/DoctorList",[]);
						oModel.setProperty("/DoctorList",doctorListArray);
						doctorListArray = [];
					});
				})
				dataBase.transaction(function (tx) {
					tx.executeSql('SELECT COUNT(*) AS c FROM doctorTable', [], function (tx, r) {
						console.log( r.rows.item(0).c);
						oModel.setProperty("/doctorCountModel",r.rows.item(0).c);						
					}, function (tx, e) {
						alert ("unknown: " + e.message);
					});
				});
			},
			updateDoctorDialogClose: function(oEvent){
				_this.addUpdateDoctorDialog.close();
				_this.addUpdateDoctorDialog.destroy(true);
			},
			updateDoctorToDB: function(oEvent){
				var doctorModelUpdate=oModel.getProperty(sPath);
				var doctorName=sap.ui.getCore().byId("idEditDoctorName").getValue();
				var doctorUpdateUnvan=sap.ui.getCore().byId("idEditDoctorUnvan").getValue();
				//alert(doctorID);
				dataBase.transaction(function(tx) {
					tx.executeSql('UPDATE doctorTable SET doctorAd=?, doctorUnvan=? WHERE id=? ',[ doctorName,doctorUpdateUnvan,doctorID],function(a,b){
						doctorModelUpdate.doctorAd=doctorName;
						doctorModelUpdate.doctorUnvan=doctorUpdateUnvan;
						oModel.refresh();
						_this.addUpdateDoctorDialog.close();
					});     
				});		
			},
			editDoctor : function(oEvent) {
				_this=this;
				if(!_this.addUpdateDoctorDialog){
					_this.addUpdateDoctorDialog = sap.ui.xmlfragment("newProject.Doktor.fragments.doctorUpdateDialog", this);
				}
				_this.addUpdateDoctorDialog.open();	
				oData = oModel.getData().DoctorList;
				sPath = oEvent.getSource().getBindingContext().getPath();
				alert(sPath);
				var doctorList=oModel.getProperty(sPath);
				alert("ID:"+doctorList.id+" Name:"+doctorList.doctorAd+" Unvan:"+doctorList.doctorUnvan);
				doctorID=doctorList.id;
				sap.ui.getCore().byId("idEditDoctorName").setValue(doctorList.doctorAd);
				sap.ui.getCore().byId("idEditDoctorUnvan").setValue(doctorList.doctorUnvan);
			}
		});
});
