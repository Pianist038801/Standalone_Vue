// imports
// ******************************************
import Vue from 'vue';
import Vuex from 'vuex'

import VueResource from 'vue-resource';
import VueMoment from 'vue-moment'; 
import {Tabs, Tab} from 'vue-tabs-component';
import axios from 'axios';
import Multiselect from '../components/name-select/src/Multiselect.vue';
import boardBlock from '../components/home/board-block.vue';
import store from './store.js';

Vue.use(Vuex)
Vue.use(Multiselect)
Vue.use(VueResource);
Vue.use(VueMoment);
Vue.use(boardBlock);
Vue.component('tabs', Tabs);
Vue.component('tab', Tab);
import schedulingPage from "pages/scheduling.vue";

import appointment from "../components/appointment/appointment.vue";
import allergies from "../components/allergies/allergies.vue";
import encounters from "../components/encounters/encounters.vue";
import referral from "../components/referral/referral.vue";
import journeyMap from "../components/journey-map/journey-map.vue";
import card from "../components/card/card.vue";

// import css style to app
import '../scss/main.scss';

import '../svg-sprite/_svg-strite';


import sidebarPacient from "../components/sidebar/sidebar.vue";
import patientInfo from "../components/patient-info/patient-info.vue";
import pharmacy from "../components/pharmacy/pharmacy.vue";
import insuranceVerification from "../components/insurance-verification/insurance-verification.vue";
import makeAppointment from "../components/make-appointment/make-appointment.vue";
import cManagment from "../components/case-managment/case-managment.vue";
import cManagmentIncidents from "../components/case-managment/case-managment-incidents.vue";
import cManagmentIncident from "../components/case-managment/case-managment-incident.vue";
import patientBilling from "../components/billing/patient-billing.vue";
import billingHistory from "../components/billing/billing-history.vue";
import statementReview from "../components/billing/statement-review.vue";
import paymentConfirmation from "../components/billing/payment-confirmation.vue";
import paymentResult from "../components/billing/payment-result.vue";
import phoneBook from "../components/modal-component/phone-book.vue";
import searchPatient from "../components/modal-component/search-patient.vue";
import updateReferral from "../components/modal-component/update-referral.vue";
import detailReferral from "../components/modal-component/detail-referral.vue";

let appData = {
  activePacient: 1,
  showImageModal: 0,
  currentShowBox: null,
  currentShowSubBox: null,
  addNewCallerName: false,
  billItem: null,
  paymentResult: null,
  userIsVerify: false,
  currentShowPhoneBook: false,
  currentShowSearchPatient: false,
  currentShowDetailReferral: false,
  currentShowUpdpateReferral: false,
  newCallerName: '',
  callerName: 'Johns Jacobs',
  callerPhone: '+1 214 701 5489',
  callerType: 'Parent',
  callerNotes: 'Transferred from Agent at Contact Center in regards to Speciality Appointment',
  callDestination: 'a',
  callerTransferLocation: 'NA',
  callerHospital: 'NA',
  patientNames: ['a','s'],
  dropdownCallerName: 'Johns Jacobs',
  dropdownCallerType: 'Parent',
  agentID: '',
  referralIndex: 0,
  epicProcesses: ['Encounter', 'Contracts', 'Assessment', 'Protocol', 'Disposition', 'Care Advice',' Routing'],
};

let App = new Vue({
  data: appData,
  store,
  // router,
  created(){
    let vm = this;
    this.getInfoFromAgent();
  },
  mounted() {
    let vm = this;
    vm.activePacient = 1;
    vm.currentShowBox = 'home';
    vm.spaceWidget =  window.ciscosparkClient();
    Vue.http.get('demo-credentials.json').then((response) => {
      vm.spaceWidget.init(response.data);
    });
  },
  methods: {
    getCurrentIndexPacient: function(txt) {
      if(txt == 'add New')
      {
        this.newCallerName='';
        this.addNewCallerName = true;
      }
    },
    onKeyPress: function(event) {
      if(event.keyCode==13)
      {
        this.addNewCallerName = false;
        if(this.newCallerName=='')
          return;
        let temp = this.patientNames.slice(0);
        temp.splice(1,0,this.newCallerName);
        this.patientNames = temp;
        
      }
    },
    releaseTempDNIS: function(tempDNIS) {
      axios({method: 'post',
        url: 'http://office.healthcareintegrations.com:8900/releaseTempDNIS',
        responseType: 'json',
        data: {tempDNIS}
      }
      )
      .then(function(response){
          console.log('Get_CallInfo_Axios_Response=', response);
          if(response.data.error){
            console.error('Error in Releasing TempDNIS');
          }
          else{
            console.log('TempDNIS released');
          }
      });
    },
    getInfoFromAgent: function() {
      let vm = this;
      //Get TempDNIS from the url
      var url = new URL(window.location.href);
      var tempDNIS = url.searchParams.get("tempDNIS");
      console.log('TempDNIS=', tempDNIS);

      axios({method: 'post',
        url: 'http://office.healthcareintegrations.com:8900/getTempDNIS',
        responseType: 'json',
        data: {tempDNIS}
      }
      )
      .then(function(response){
          console.log('Get_CallInfo_Axios_Response=', response);
          // if(response.data.error){
          //     console.error('No TempDNIS Found.')
          // }
          // else{
            // const responseData = response.data;
            //vm.callerName = responseData.callerName;
            vm.callerName = 'Johns Jacobs'
            //vm.callerPhone = responseData.callerPhone;
            vm.callerPhone = '+1 214 701 5489';
            //vm.callerType = responseData.callerType;
            vm.callerType = 'Parent';
            //vm.callerNotes = responseData.notes;
            vm.callerNotes = 'Transferred from Agent at Contact Center in regards to Speciality Appointment';
            //vm.activePacient = responseData.patientName.indexOf('Sarah') > -1 ? 1 : 0;
            vm.activePacient = 1;
            // vm.agentID = responseData.phantom3;
            // console.log('AGID=', vm.agentID);
            vm.releaseTempDNIS(tempDNIS);
          // }
      });
    },
    showSpaceWidget: function () {
      var vm = this;
      var $el = document.getElementById("huddle-room-mount");
      if($el){
        vm.spaceWidget.render($el);
      }
    },
    showPhoneBook: function () {
      var vm = this;
      console.log('PHONE_CLICKED: !!!', vm.currentShowPhoneBook )
      vm.currentShowPhoneBook = !vm.currentShowPhoneBook;
    },
    showSearchPatient: function () {
      this.currentShowSearchPatient = !this.currentShowSearchPatient
    },
    showDetailReferral: function (index) {
      this.referralIndex = index;
      this.currentShowDetailReferral = !this.currentShowDetailReferral
    },
    showUpdateReferral: function (index) {
      this.referralIndex = index;
      this.currentShowUpdateReferral = !this.currentShowUpdateReferral
    },
    openNewWindow(url) {
      let strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
      window.open(url, "CNN_WindowName", strWindowFeatures);
    },
    showStatementReview: function(item) {
      this.currentShowBox = 'statement_review';
      console.log('*&&**&(*&(*&*(&', item);
      this.billItem = item;
    },
    payBill: function(item) {
      this.currentShowBox = 'payment_confirmation';
      this.billItem = item;
    },
    showPaymentResult: function (item) {
      this.currentShowBox = 'payment_result';
      console.log('SDFSDF', item);
      this.paymentResult = item;
    },
    showImage: function () {
      this.showImageModal = this.showImageModal + 1;
    },
    goBack: function (item) {
      this.currentShowBox = 'billing';
    }
  },
  components: {
    sidebarPacient,
    card,
    appointment,
    allergies,
    encounters,
    referral,
    journeyMap,
    patientInfo,
    pharmacy,
    insuranceVerification,
    makeAppointment,
    cManagment,
    cManagmentIncidents,
    cManagmentIncident,
    patientBilling,
    billingHistory,
    statementReview,
    paymentConfirmation,
    paymentResult,
    phoneBook,
    Multiselect,
    boardBlock,
    searchPatient,
    updateReferral,
    detailReferral,
  },
  watch: {
    currentShowBox: function () {
      this.currentShowSubBox = null;
    },
  }
});


// ajax send data form to url - get list ID's

// window.location
// search: "?data=demo-mockup"


function getSearchParameters() {
  var prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}
function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
    var tmparr = prmarr[i].split("=");
    params[tmparr[0]] = tmparr[1];
  }
  return params;
}
var paramsUrl = getSearchParameters();

let urlData = paramsUrl.data? `data/${paramsUrl.data}`:'data/demo-mockup.json';
let downloadURL = 'https://firebasestorage.googleapis.com/v0/b/finesse-2346d.appspot.com/o/mountains.json?alt=media&token=86019233-afb7-4934-946f-2ca00ce2037e';

Vue.http.get(urlData)
  // get access
  .then(
    (response) => {
      console.log(response);
      let data = response.body;
      console.log('data=', data)
      let array = ['EPIC']; 
      data.Patients.forEach((item, i) => {
          if(item.Category=='EPIC')
              array.push(item.Name);
      });
      
      array.push('add New')
      data.patientNames = array.slice(0);
      //
        appData = Object.assign(appData, data);

        App.$mount('#app');
        
      // Vue.http.get(downloadURL).then((res)=>{
      //   data = Object.assign(data, {callInfos: res.body})
      //   appData = Object.assign(appData, data);
      //   App.$mount('#app');
      // })

    });
