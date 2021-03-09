import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Divider, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import Dropdown, { MenuItem, } from '@trendmicro/react-dropdown';
import { DigitalSignageModal } from './ProductionForAction/Modals/Modals';
import { isNullOrUndefined } from 'components/HelperMethods/ReusableComponents';
import axios from 'axios';
import { logMessages, errorLogMessages } from './ProductionForAction/LogMessages';
import { StringTranslator, translateString } from './HelperMethods/ReusableComponents';
import { FaRegFilePdf,FaFileCsv,FaFileSignature,FaFilePdf,FaQuestionCircle} from "react-icons/fa";

import { FiHelpCircle,FiPrinter } from "react-icons/fi";
import { GrDocumentCsv} from "react-icons/gr";


const AppBar = require('../Images/MenuIcon.png');
type Props = RouteComponentProps<{}>;
  
export class LinkTitle extends React.Component<Props | any,
    {
        linkTitle: string;
        IsReport: boolean;
        hasCharts: boolean;
        ContentCode: string;
        AssemblyRules: any;
        EnableDigitalSignage: boolean;
        showDigitalSignageModal: boolean;
        DisableTitle: boolean
        server: any
        userID: any
        latitude: number
        longitude: number
        ipAddress: any
    }> {
    static propTypes: any;
    _isMounted: boolean = false;
    constructor(props: any) {
        super(props)
        let server = !isNullOrUndefined(localStorage.getItem('servername')) ? localStorage.getItem('servername') : "";
        const userId = !isNullOrUndefined(localStorage.getItem('userID')) ? localStorage.userID : "";
        this.state = {
            linkTitle: '',
            IsReport: false,
            ContentCode: '',
            AssemblyRules: new Array(),
            hasCharts: false,
            EnableDigitalSignage: false,
            showDigitalSignageModal: false,
            DisableTitle: false,
            server: server,
            userID: userId,
            latitude: 0,
            longitude: 0,
            ipAddress: 0,
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.setUpLinkTitle();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //[XQ: 9/11//2020] - update the link title component update func for updating the link title for the dynamic forms
    //[XQ: 9/1//2020] - clean up the code for the right type comparision, comparing the boolean type to a function, statement will always return true
    componentDidUpdate(prevProps: any) {
        // console.log(this.props,"-------this props will update?----------")
        // if (prevProps.openInstructions !== this.state.openInstructions) {
        //     this.setState({
        //         openInstructions: this.props.openInstructions,
        //     })
        // }
        //[XQ: 9/11/2020] - rewrite the function to update the link title as expected
        if (!isNullOrUndefined(this.props.dynamicFormId) && prevProps.dynamicFormId !== this.props.dynamicFormId) {
            this.setUpLinkTitle();
        }

    }
    //[XQ: 9/11/2020] - set up link title
    setUpLinkTitle = () => {
        let webroute = window.location.pathname.split('/')[2]
        let grouplinks = localStorage.appState ? JSON.parse(localStorage.appState).grouplinks : [];
        let title = grouplinks.find(function (link: any) {

            if (window.location.pathname.split('/').length > 3) {
                if (link.WebRoute === window.location.pathname.split('/')[2] + '/' + window.location.pathname.split('/')[3]) {
                    return link
                }
            }
            else if (link.WebRoute === webroute) {
                return link
            }
            //[XQ: 4/30/2020] - Just for test here;
            else if (window.location.pathname.includes('workflow/') && link.WebRoute.includes('workflow/')) {
                return link;
            }
        })
        if (title) {
            this.getGeoLocation()
            // console.log(title, "---------title from the group links----this prop from the -----", this.props)
            this.setState({
                linkTitle: title.LinkTitle,
                IsReport: title.IsReport,
                ContentCode: title.ContentCode,
                hasCharts: title.ContainsCharts,
                DisableTitle: title.DisableTitle,
                EnableDigitalSignage: title.EnableDigitalSignature
                // longitude: longitude,
                // latitude: latitude,
            })
        }
    } 

    getGeoLocation() {
        let geo = !isNullOrUndefined(localStorage.getItem('Geolocation')) ? JSON.parse(localStorage.Geolocation) : 0;
        if (geo !== 0) {
            let latitude = geo[0].latitude
            let longitude = geo[0].longitude
            this.setState({
                longitude, latitude
            }, () => {
                this.getIP()
            })
        }
    }

    getIP() {
        let ip = ""
        axios.get(`${this.state.server}`)
            .then((res) => {
                ip = res.data
                this.setState({
                    ipAddress: ip
                })
            })
            .catch(err => console.log(err));
    }

   
    // [AL 06/15/2020] -- this contruct menuItem for dropdown
    contructMenuItem() {
        let { IsReport, hasCharts, EnableDigitalSignage } = this.state
        let menuItem: any = new Array();
        /* do not change the event key, the event key should be unique */
        if (!isNullOrUndefined(this.props.openInstructions)) {
            menuItem.push(
                <MenuItem className="react-icons"  key={"menu1"} eventKey={1}
                    onSelect={(eventKey: any) => {
                        this.props.openInstructions();
                    }}
                ><FiHelpCircle size= "3em" />
            </MenuItem>)
        }
        if (IsReport) {
            if (menuItem.length !== 0) {
                menuItem.push(
                    <MenuItem key={"menudivider1"} divider />)
            }
            menuItem.push(
                <MenuItem className="react-icons" key={"menu2"} eventKey={2}
                    onSelect={(eventKey: any) => {
                        this.props.ExportReport()
                    }}
                ><FaFilePdf  size="3em"/></MenuItem>)
            menuItem.push(
                <MenuItem key={"menudivider1b"} divider />)
            menuItem.push(
                <MenuItem className="react-icons" key={"menu3"} eventKey={3}
                    onSelect={(eventKey: any) => {
                        this.props.ExportCSV()
                    }}
                ><FaFileCsv size="3em"/></MenuItem>)
        }
        if (hasCharts) {
            if (menuItem.length !== 0) {
                menuItem.push(
                    <MenuItem key={"menudivider2"} divider />) 
            }
    
            menuItem.push(
                <MenuItem className="react-icons" key={"menu4"} eventKey={4}
                    onSelect={(eventKey: any) => {
                        this.props.openPrintChartsModal()
                    }} 
                ><FiPrinter  size="3em" /></MenuItem>)
        }
        if (EnableDigitalSignage) {
            if (menuItem.length !== 0) {
                menuItem.push(
                    <MenuItem key={"menudivider3"} divider />)
            }
            menuItem.push(
                <MenuItem className="react-icons signaturespace" key={"menu5"} eventKey={5}
                    onSelect={(eventKey: any) => {
                        this.openDigitalSignageModal()
                    }}
                ><FaFileSignature  size="3em" /></MenuItem>)
        }
        return menuItem
    }

    openDigitalSignageModal = () => {
        this.setState({ showDigitalSignageModal: true })
    }
    closeDigitalSignageModal = () => {
        this.setState({ showDigitalSignageModal: false })
    }

    // [AL 07/07/2020] --- fix condition in concatting string  &&  added toggle filtering as new toggle added to Stop Event Report from another task
    // [AL 07/01/2020] -- this is to get variables from the pages from the dropdowns and checkbox by curating from the web itself, using className etc. 
    //                    Mainly use in Report pages
    getFields = (key) => {
        let digiKey = key[0][0].DigitalSignatureKey
        let filter = ""
        let filterValue = ""
        let filterDesc = ""

        //** normal selector --line,shift,crew, etc
        const arrSelectComponent = Array.from(document.querySelectorAll("select"))
        if (!isNullOrUndefined(arrSelectComponent) && arrSelectComponent.length > 0) {
            // console.log(arrSelectComponent, "---arr---", arrSelectComponent[0].name, arrSelectComponent[0].value)
            arrSelectComponent.map((d: any, i: number) => {
                if (i == arrSelectComponent.length - 1) {
                    filter = filter + d.name
                    filterValue = filterValue + d.value
                    filterDesc = filterDesc + d.name + " " + d.value
                }
                else {
                    filter = filter + d.name + " | "
                    filterValue = filterValue + d.value + " | "
                    filterDesc = filterDesc + d.name + " " + d.value + " | "
                }
            })
        }

        //** selector of date
        const arrSelectDate: any | unknown = Array.from(document.querySelectorAll("div.selectDate"))
        if (!isNullOrUndefined(arrSelectDate) && arrSelectDate.length > 0) {
            // console.log(arrSelectDate, "---arrSelectDate---", arrSelectDate[0])
            // const dateLabel: any | unknown = Array.from(arrSelectDate[0].querySelectorAll("label.dateLabel"))
            // let filterdate: any | unknown = Array.from(arrSelectDate[0].querySelectorAll("div.dateValue"))
            // const dateValue: any | unknown = filterdate[0].querySelectorAll("input")
            // console.log(dateLabel[0].textContent, "---------dataLabel------------", dateValue[0].value, "---------dateValue------------")
            // console.log(filter.length > 0)
            if (filter.length > 0) {
                filter += " | "
                filterValue += " | "
                filterDesc += " | "
            }
            arrSelectDate.map((d: any, i: number) => {
                const datelabel: any = Array.from(d.querySelectorAll("label.dateLabel"))
                let filterdate: any = Array.from(d.querySelectorAll("div.dateValue"))
                const dateValue: any = filterdate[0].querySelectorAll("input")
                if (i == arrSelectDate.length - 1) {
                    filter = filter + datelabel[0].textContent
                    filterValue = filterValue + dateValue[0].value
                    filterDesc = filterDesc + datelabel[0].textContent + " " + dateValue[0].value
                }
                else {
                    filter = filter + datelabel[0].textContent + " | "
                    filterValue = filterValue + dateValue[0].value + " | "
                    filterDesc = filterDesc + datelabel[0].textContent + " " + dateValue[0].value + " | "
                }
            })
        }

        //** selector of time
        const arrSelectTime = Array.from(document.querySelectorAll("div.selectTime"))
        if (!isNullOrUndefined(arrSelectTime) && arrSelectTime.length > 0) {
            // console.log(arrSelectTime, "---arrSelectTime---", arrSelectTime[0])
            // const timeLabel = Array.from(arrSelectTime[0].querySelectorAll("label.timeLabel"))
            // const timeValue = (Array.from(arrSelectTime[0].querySelectorAll("div.timeValue")))[0].querySelectorAll("input")
            // console.log(timeLabel[0].textContent, "---------timelabel------------", timeValue[0].value, "---------time Value------------")

            if (filter.length > 0) {
                filter += " | "
                filterValue += " | "
                filterDesc += " | "
            }
            arrSelectTime.map((d: any, i: number) => {
                const timeLabel: any = Array.from(d.querySelectorAll("label.timeLabel"))
                let filtertime: any = Array.from(d.querySelectorAll("div.timeValue"))
                const timeValue: any = filtertime[0].querySelectorAll("input")
                if (i == arrSelectTime.length - 1) {
                    filter = filter + timeLabel[0].textContent
                    filterValue = filterValue + timeValue[0].value
                    filterDesc = filterDesc + timeLabel[0].textContent + " " + timeValue[0].value
                }
                else {
                    filter = filter + timeLabel[0].textContent + " | "
                    filterValue = filterValue + timeValue[0].value + " | "
                    filterDesc = filterDesc + timeLabel[0].textContent + " " + timeValue[0].value + " | "
                }
            })
        }

        //** selector of dateTime
        const arrSelectDateTime = Array.from(document.querySelectorAll("div.selectDateTime"))
        if (!isNullOrUndefined(arrSelectDateTime) && arrSelectDateTime.length > 0) {
            // console.log(arrSelectDateTime, "---arrSelectTime---", arrSelectDateTime[0])
            const dateTimeLabel = Array.from(arrSelectDateTime[0].querySelectorAll("label.dateTimeLabel"))
            const dateTimeValue = (Array.from(arrSelectDateTime[0].querySelectorAll("div.dateTimeValue")))[0].querySelectorAll("input")
            // console.log(dateTimeLabel[0].textContent, "---------dateTimeLabel------------", dateTimeValue[0].value, "---------time Value------------")
            if (filter.length > 0) {
                filter += " | "
                filterValue += " | "
                filterDesc += " | "
            }
            arrSelectDateTime.map((d: any, i: number) => {
                const dateTimeLabel: any = Array.from(d.querySelectorAll("label.dateTimeLabel"))
                let filterdatetime: any = Array.from(d.querySelectorAll("div.dateTimeValue"))
                const dateTimeValue: any = filterdatetime[0].querySelectorAll("input")
                if (i == arrSelectDateTime.length - 1) {
                    filter = filter + dateTimeLabel[0].textContent
                    filterValue = filterValue + dateTimeValue[0].value
                    filterDesc = filterDesc + dateTimeLabel[0].textContent + " " + dateTimeValue[0].value
                }
                else {
                    filter = filter + dateTimeLabel[0].textContent + " | "
                    filterValue = filterValue + dateTimeValue[0].value + " | "
                    filterDesc = filterDesc + dateTimeLabel[0].textContent + " " + dateTimeValue[0].value + " | "
                }
            })
        }

        //** selector of checkbox
        const arrSelectCheckbox = Array.from(document.querySelectorAll("div.checkBox"))
        if (!isNullOrUndefined(arrSelectCheckbox) && arrSelectCheckbox.length > 0) {
            // console.log(arrSelectCheckbox, "---arrSelectCheckbox---", arrSelectCheckbox[0] )
            const checkLabel = arrSelectCheckbox[0].children[1].textContent //Array.from(arrSelectCheckbox[0].querySelectorAll("label.checkboxLabel")) sdvdsvdvdddsvdsvdsvvdsdddddddddddddvdddd
            // arrSelectCheckbox[0]//.innerText// Array.from(arrSelectCheckbox[0].querySelectorAll("label.checkboxLabel"))
            const checkValue = Array.from(arrSelectCheckbox[0].querySelectorAll("input"))[0].defaultChecked
            // console.log(checkLabel, "--------check label ---- chaeck value---", checkValue)

            if (filter.length > 0) {
                filter += " | "
                filterValue += " | "
                filterDesc += " | "
            }
            arrSelectCheckbox.map((d: any, i: number) => {
                const checkLabel: any = d.children[1].textContent
                let filtercheck: any = Array.from(d.querySelectorAll("input"))
                const checkValue: any = filtercheck[0].defaultChecked
                if (i == arrSelectCheckbox.length - 1) {
                    filter = filter + checkLabel
                    filterValue = filterValue + checkValue
                    filterDesc = filterDesc + checkLabel + " " + checkValue
                }
                else {
                    filter = filter + checkLabel + " | "
                    filterValue = filterValue + checkValue + " | "
                    filterDesc = filterDesc + checkLabel + " " + checkValue + " | "
                }
            })
        }

        //** [AL 07/07/2020] --add selector toggle */
        const arrToggle = Array.from(document.querySelectorAll("div.toggle"))
        if (!isNullOrUndefined(arrToggle) && arrToggle.length > 0) {
            // console.log(arrToggle, "---arrToggle---", arrToggle[0] )

            if (filter.length > 0) {
                filter += " | "
                filterValue += " | "
                filterDesc += " | "
            }
            arrToggle.map((d: any, i: number) => {
                const toggleLabel: any = d.children[0].textContent
                let filterToggle: any = Array.from(d.querySelectorAll("input"))
                const toggleValue: any = filterToggle[0].defaultValue
                if (i == arrSelectCheckbox.length - 1) {
                    filter = filter + toggleLabel
                    filterValue = filterValue + toggleValue
                    filterDesc = filterDesc + toggleLabel + " " + toggleValue
                }
                else {
                    filter = filter + toggleLabel + " | "
                    filterValue = filterValue + toggleValue + " | "
                    filterDesc = filterDesc + toggleLabel + " " + toggleValue + " | "
                }
            })
        }

        //** selector for 3x3 machinecount + causecount
        const arrSelectMachine = Array.from(document.querySelectorAll("div.MachineCount"))
        const arrSelectCause = Array.from(document.querySelectorAll("div.StopCount"))
        if (!isNullOrUndefined(arrSelectMachine) && arrSelectMachine.length > 0) {
            // console.log(arrSelectMachine, "---arrSelectMachine---", arrSelectMachine[0] )
            // const machineLabel = "machineCount"
            // const machineValue = Array.from(arrSelectMachine[0].querySelectorAll("input"))[0].valueAsNumber
            // // console.log(machineLabel,"---------machineLabel machineValue------------",machineValue)
            // // console.log(arrSelectCause, "---arrSelectCause---", arrSelectCause[0] )
            // const countLabel = "stopCauseCount"
            // const countValue = Array.from(arrSelectCause[0].querySelectorAll("input"))[0].valueAsNumber
            // console.log(countLabel,"---------countLabel countValue------------",countValue)

            if (filter.length > 0) {
                filter += " | "
                filterValue += " | "
                filterDesc += " | "
            }
            const machineLabel = "machineCount"
            let filtermachine: any = Array.from(arrSelectMachine[0].querySelectorAll("input"))
            const machineValue = filtermachine[0].valueAsNumber
            const countLabel = "stopCauseCount"
            let filtercause: any = Array.from(arrSelectCause[0].querySelectorAll("input"))
            const countValue = filtercause[0].valueAsNumber
            filter = filter + machineLabel + " | " + countLabel
            filterValue = filterValue + machineValue + " | " + countValue
            filterDesc = filterDesc + machineLabel + " " + machineValue + " | " + countLabel + " " + countValue
        }

        //**selector for dailyEquipment multiple select stopCategory
        const arrSelectMulti = Array.from(document.querySelectorAll("div.selectMulti"))
        if (!isNullOrUndefined(arrSelectMulti) && arrSelectMulti.length > 0) {
            const multiValue = Array.from(arrSelectMulti[0].querySelectorAll("input"))
            // console.log(arrSelectMulti, "---arrSelectMulti---", arrSelectMulti[0])
            // const multiLabel = arrSelectMulti[0].children[1].textContent //Array.from(arrSelectMulti[0].querySelectorAll("label.checkboxLabel")) 
            // console.log(multiLabel, "---------multiLabel multiValue------------", multiValue, "--multiValuemultiValue----", multiValue[1].defaultValue)
            if (filter.length > 0) {
                filter += " | "
                filterValue += " | "
                filterDesc += " | "
            }
            let value = ""
            multiValue.map((d: any, i: number) => {
                if (i == multiValue.length - 1) {
                    value += d.defaultValue
                }
                else if (i == 0) { }
                else {
                    value += d.defaultValue + ", "
                }
            })
            filter = filter + "Stop Category"
            filterValue = filterValue + value
            filterDesc = filterDesc + "Stop Category" + " " + value
        }

        // console.log(filter, "---filter =-----value-", filterValue, "--desc--", filterDesc,"----key--0--",digiKey)
        this.SignDetailsInsert(digiKey, filter, filterValue, filterDesc)
    }

    SignDetailsInsert(key, filter, filterValue, filterDesc) {
        // console.log(key,"------------key---------",filter,filterValue,filterDesc)
        let url = `${this.state.server}/api/digitalSignatureDetailInsert`
        axios.post(url, {
            DigitalSignatureKey: key,
            Filter: filter,
            FilterValue: filterValue,
            FilterDescription: filterDesc
        })
            .then(res => {
                console.log(res)
                logMessages(translateString("Success!"), res.status, translateString("The digital signature has been successfully inserted!"), 3000, "success");
            })
            .catch(error => {
                errorLogMessages(error);
            })
    }

    render() {
        const { IsReport, hasCharts, ContentCode, AssemblyRules, DisableTitle } = this.state;
        // console.log(this.state.latitude,this.state.longitude,"-----linktitle coordinates---- render------")
        if (DisableTitle) {
            return ("")
        }
        else {
            return (
                <div className="">
                    <div className="d-flex flex-row flex-nowrap justify-content-between align-items-center pt-4 pb-2 wrap" id="pageTitle" style={{ fontSize: '1em', }}>
                        <div className="row d-flex flex-row flex-nowrap">
                            <div className="font-weight-bold col-12 ">
                                <div id="pageFontStyle" >
                                    {this.state.linkTitle.length > 0 ? translateString(this.state.linkTitle) : this.props.defaultTitle}
                                </div>
                            </div>
                        </div>
                        {/* [AL 06/12/2020] -- change of design layout  */}
                        <div className="settingBox">
                   
                                    {this.contructMenuItem()}
                          
                        </div>
                    </div>
                    <DigitalSignageModal
                        showDigitalSignageModal={this.state.showDigitalSignageModal}
                        closeDigitalSignageModal={() => { this.closeDigitalSignageModal() }}
                        linkTitle={this.state.linkTitle}
                        state={this.state}
                        userID={this.state.userID}
                        server={this.state.server}
                        ContentCode={this.state.ContentCode}
                        longitude={this.state.longitude}
                        latitude={this.state.latitude}
                        ipAddress={this.state.ipAddress}
                        getFields={(e) => { this.getFields(e) }}
                    />
                </div>
            )
        }
    }

}
