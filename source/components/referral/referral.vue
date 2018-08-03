<template lang="pug">
    .appointment
        .appointment__top
            .appointment__top-filter
                svg.ico-svg.ico-svg__filter-results-button
                    use(xlink:href="#filter-results-button")
                span All referrals
            .appointment__top-data
                svg.ico-svg.ico-svg__calendar
                    use(xlink:href="#calendar")
                span {{["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][new Date().getMonth()]}} {{new Date().getDate()}}, {{new Date().getFullYear()}}
        table.appointment__table
            tr
                th Ref ID
                th Auth start date
                th Auth end date
                th Patient Name
                th Patient ID
                th Procedures
                th Referred By
                th Referred To(Dept)
                th Referred To(Facility Add)
                th Referred To(Provider Name, Add)
                th Facility Name
                th Actions
            tr(v-for="(item, index) in patients.PastAppointments")
                td Ref ID
                td Auth start date
                td Auth end date
                td Patient Name
                td Patient ID
                td Procedures
                td Referred By
                td Referred To(Dept)
                td Referred To(Facility Add)
                td Referred To(Provider Name, Add)
                td Facility Name
                td.more-action
                    .sub-popup-menu
                        .sub-popup-menu__action
                            svg.ico-svg.ico-svg__more
                                use(xlink:href="#more")
                        .sub-popup-menu__list
                            a(href="#3", @click.prevent="openModalInfo(index)").sub-popup-menu__item Show in EPIC
                            a(href="#3").sub-popup-menu__item Assign
                            a(href="#3").sub-popup-menu__item Unassign
                            a(href="#3").sub-popup-menu__item Update

        modal(ref="modalInfo")
            .modal__content(v-if="currentMoreInfoIndex !== null")

                .modal__content-row
                    .modal__content-col

                        .modal-appointment__title
                            .title.mod--modal-appointment Appointment details

                            .modal-appointment__info
                                svg.ico-svg.ico-svg__clock
                                    use(xlink:href="#clock")
                                | Appointment time: <b> {{ [patients.PastAppointments[currentMoreInfoIndex].Time, "HH:mm:ss"] | moment("h:mm a") }}</b>

                            .modal-appointment__info
                                svg.ico-svg.ico-svg__calendar
                                    use(xlink:href="#calendar")
                                | Appointment date: <b>{{ [patients.PastAppointments[currentMoreInfoIndex].Date, ["M-DD-YYYY HH:mm:ss","D-MMM-YYYY HH:mm:ss"]] | moment("MMM DD, YYYY") }}</b>

                            .modal-appointment__info
                                | Hospital/clinic name: <b> {{patients.PastAppointments[currentMoreInfoIndex].Department}}</b>

                            .modal-appointment__info
                                | Appointment type: <b>{{patients.PastAppointments[currentMoreInfoIndex].VisitType}}</b>

                            .modal-appointment__info
                                | Reason for visit: <b>{{patients.PastAppointments[currentMoreInfoIndex].VisitReason}}</b>
                            .modal-appointment__info
                                | Interpreter required: <b>{{patients.PastAppointments[currentMoreInfoIndex]['Appointment Details']['Interpreter Required']}}</b>

                            .modal-appointment__info(v-if="patients.PastAppointments[currentMoreInfoIndex]['Appointment Details']['Interpreter Language'] !== 'None'")
                                .modal-appointment__lang-ico
                                    svg.ico-svg.ico-svg__lang
                                        use(xlink:href="#lang")
                                | Interpreter required: <b>{{patients.PastAppointments[currentMoreInfoIndex]['Appointment Details']['Interpreter Language']}}</b>

                    .modal__content-col
                        .modal-appointment__map
                            gmap-map(
                            :center="{lat: 32.9448268, lng: -96.64587949999998}",
                            :zoom="14",
                            style="width: 100%; height: 300px"
                            )
                                gmap-marker(
                                :key="1",
                                :position="{lat: 32.9448268, lng: -96.64587949999998}",
                                )



</template>
<script>
    import modal from "../modal-component/modal.vue";

    export default {
        props: ['patients'],
        components: {
            modal
        },
        data() {
            return {
                visible: false,
                currentMoreInfoIndex: null
            }
        },
        methods: {
            open() {},

            openNewWindow(url){
                let strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
                window.open(url, "CNN_WindowName", strWindowFeatures);

            },

            openModalInfo(index){
                this.currentMoreInfoIndex = index;
                this.$refs.modalInfo.open();
            }
        },
        mounted() {},
        beforeDestroy() {},
    }
</script>
<style lang="scss">
    @import '~mixinsSCSS';

    .appointment {
        margin-bottom: em(80);
    }

    .appointment__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: em(60);
    }

    .appointment__top-filter {
        display: flex;
        justify-content: center;
        align-items: center;
        .ico-svg__filter-results-button {
            margin-right: em(20);
            width: em(18px);
            height: em(12px);
            use {
                fill: #000;
            }
        }
    }

    .appointment__top-data {
        display: flex;
        justify-content: center;
        align-items: center;
        .ico-svg__calendar {
            margin-right: em(20);
            width: em(18px);
            height: em(20px);
            use {
                fill: #000;
            }
        }
    }

    .appointment__table {
        width: 100%;
        border-spacing: 0;

        td, th {
            padding: em(14 8);
            text-align: left;
        }
        th {
            border-bottom: 1px solid #ebebeb;
        }
    }

</style>
