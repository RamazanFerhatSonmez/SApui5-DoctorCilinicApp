sap.ui.define(["sap/ui/core/mvc/Controller",'jquery.sap.global'],
	function(Controller) {
		"use strict";
		var _this;
		var dataBase;
		var doctorID;
		var patientDiagnosisId;
		var patientDiagnosisListArray = [];
		var medicineArray=[];
		var PatientListArray=[];
		var patientIll_ID;
		var oData;
		var sPath;
		var patientCount;
		return Controller.extend("newProject.Hasta.controller.Hasta", {
			onInit:function(oEvent){
				_this = this;
				patientCount=0;
				oModel.setProperty("/comboBoxDoktorIdKey", "");
				oModel.setProperty("/patientIllName","");
				oModel.setProperty("/comboBoxIllIdKey", "");
				oModel.setProperty("/patientCountModel", "");
				oModel.setProperty("/patientMedicineNameModel",[]);
				oModel.setProperty("/patientDiagnosis",[]);
				oModel.setProperty("/PatientList",[]);
				dataBase = openDatabase('DoctorHastaApp', '1.0', 'Web SQL Veritabanı', 15*1024*1024);
				dataBase.transaction(function(tx) {
					tx.executeSql('SELECT * FROM hastalikTable ', [],function(islem, sonuc) {
						console.log(sonuc.rows);
						jQuery.each(sonuc.rows, function(index, value) {
							patientDiagnosisListArray.push(value);	
						});
						oModel.setProperty("/patientDiagnosis",patientDiagnosisListArray);
						patientDiagnosisListArray = [];

					});
				});
			},
			patientListView:function(){
				doctorID=oModel.getProperty("/comboBoxKey");
				if(oModel.oData.PatientList.length >0){
					oModel.setProperty("/PatientList",[]);
					PatientListArray=[];
				}
				dataBase.transaction(function(tx) {
					tx.executeSql('SELECT * FROM hastaTable WHERE doctorPatientId=?', [doctorID],function(islem, sonuc) {
						console.log(sonuc.rows);
						for (var i = 0; i <sonuc.rows.length; i++) {

							PatientListArray.push(sonuc.rows[i]);
						}
						oModel.setProperty("/PatientList",PatientListArray);
						// jQuery.each(sonuc.rows, function(index, value) {
						// 	PatientListArray.push(value);
						// });
					});				
				});
				dataBase.transaction(function (tx) {
					tx.executeSql('SELECT COUNT(*) AS c FROM hastaTable WHERE doctorPatientId=?', [doctorID], function (tx, r) {
						console.log( r.rows.item(0).c);
						oModel.setProperty("/patientCountModel",r.rows.item(0).c);						
					}, function (tx, e) {
						alert ("unknown: " + e.message);
					});
				});
			},
			newAddPatiend:function(){
				
				if(!_this.addPatientDialog){
					_this.addPatientDialog = sap.ui.xmlfragment("newProject.Hasta.fragments.addPatiendtDialog", _this);
				}
				_this.addPatientDialog.open();
			},
			addNewPatientDialogClose: function(){
				_this.addPatientDialog.close();
			},
			selecedPatientIll:function(){
				patientIll_ID=oModel.getProperty("/comboBoxIllIdKey");
				dataBase.transaction(function(tx3) {
					tx3.executeSql('SELECT * FROM ilacTable WHERE illId=?', [patientIll_ID],function(islem2, sonuc2) {
						console.log(sonuc2.rows);
						jQuery.each(sonuc2.rows, function(index2, value2) {
							medicineArray.push(value2);
						});
						oModel.setProperty("/patientMedicineNameModel",medicineArray);
						medicineArray=[];
					})
				});
			},
			addNewPatientToDB:function(){
				var patient_Name=sap.ui.getCore().byId("patientNameDialog").getValue();
				var patientDiagnosis = sap.ui.getCore().byId("idNewPatientDiagnosis").getValue();
				var patientMedicineName = sap.ui.getCore().byId("idPatientMedicineName").getValue();
				doctorID=oModel.getProperty("/comboBoxKey");
				dataBase.transaction(function(tx3) {
					tx3.executeSql('INSERT INTO hastaTable(patientName,doctorPatientId,patientIllName,patientMedicine_Name) VALUES(?,?,?,?)',[patient_Name,doctorID,patientDiagnosis,patientMedicineName]);  
				});	
				oModel.setProperty("/patientMedicineNameModel",[]);
				oModel.refresh();
				_this.addPatientDialog.close();
			},
			deletePatient: function (oEvent){
				oData = oModel.getData().PatientList;
				sPath = oEvent.getSource().getBindingContext().getPath();				
				var patientList=oModel.getProperty(sPath);
				dataBase.transaction(function(tx) {
					tx.executeSql('DELETE FROM hastaTable WHERE id = ?', [patientList.id], function(islem, sonuc){
					});
				});
				var iLength = sPath.length;
				var idIndex = sPath.slice(iLength - 1);
				oData.splice(idIndex, 1);
				oModel.refresh();
			},
		});
});
