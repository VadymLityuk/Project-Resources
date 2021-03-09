import React, { useState , useEffect } from 'react';
import MomentUtils from "@date-io/moment"; // choose your lib
import Moment from "moment"
import {
    KeyboardDatePicker, KeyboardTimePicker, KeyboardDateTimePicker,
    MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, Grid } from "@material-ui/core";
import {
    TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody
} from '@material-ui/core';
import { withStyles, makeStyles} from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import SaveAlt from '@material-ui/icons/SaveAlt';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Add from '@material-ui/icons/Add';
import Pause from '@material-ui/icons/Pause';
import Build from '@material-ui/icons/Build';
import Check from '@material-ui/icons/Check';
import FilterList from '@material-ui/icons/FilterList';
import Remove from '@material-ui/icons/Remove';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import SearchRounded from '@material-ui/icons/SearchRounded';
import FastForward from '@material-ui/icons/FastForward';
import FastRewind from '@material-ui/icons/FastRewind';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import axios from 'axios';
import qs from 'qs';
import {
    Slider, Paper, Box, Fab, Tooltip, Typography
} from '@material-ui/core';
import html2canvas from 'html2canvas';
import AlarmIcon from '@material-ui/icons/Alarm';
import { AppState } from '../../types/index';
import { newStore } from '../../index'
import { connect, ReactReduxContext } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from 'actions';
import { setTimeout } from 'timers';
import { StringNullableChain } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';


import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { green, red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import EventIcon from '@material-ui/icons/Event';
import InfoIcon from '@material-ui/icons/Info';
import { grid } from '@material-ui/system';
import ReactTable from 'react-table';
import pdfConverter from 'jspdf';
import { Spring } from 'react-spring/renderprops'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye} from '@fortawesome/free-solid-svg-icons';
import { FaFontAwesome } from 'react-icons/fa';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
// const pdfConverter = require('jspdf');
//
var dateFormat = require('dateformat');
//

import { createStyles,Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EmailIcon from '@material-ui/icons/Email';
import { Zoom } from '@material-ui/core';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';

//
//import TimerMixin from 'react-timer-mixin';



export const icons = {
    Check: () => <Check /> as React.ReactElement<SvgIconProps>,
    Export: () => <SaveAlt /> as React.ReactElement<SvgIconProps>,
    Filter: () => <FilterList /> as React.ReactElement<SvgIconProps>,
    FirstPage: () => <FirstPage /> as React.ReactElement<SvgIconProps>,
    LastPage: () => <LastPage /> as React.ReactElement<SvgIconProps>,
    NextPage: () => <ChevronRight /> as React.ReactElement<SvgIconProps>,
    PreviousPage: () => <ChevronLeft /> as React.ReactElement<SvgIconProps>,
    Search: () => <Search /> as React.ReactElement<SvgIconProps>,
    ThirdStateCheck: () => <Remove /> as React.ReactElement<SvgIconProps>,
    ViewColumn: () => <ViewColumn /> as React.ReactElement<SvgIconProps>,
    DetailPanel: () => <ChevronRight /> as React.ReactElement<SvgIconProps>,
    Remove: () => <Remove /> as React.ReactElement<SvgIconProps>,
    Add: () => <Add /> as React.ReactElement<SvgIconProps>,
    Clear: () => <Clear /> as React.ReactElement<SvgIconProps>,
    Delete: () => <Delete /> as React.ReactElement<SvgIconProps>,
    Edit: () => <Edit /> as React.ReactElement<SvgIconProps>,
    ResetSearch: () => <Clear /> as React.ReactElement<SvgIconProps>
}

export const defaultMaterialTheme = createMuiTheme({
    palette: {
        primary: { main: '#212529' },
    },
});

export const activeItem = {
    backgroundColor: '#212529',
    color: 'white',
    fontWeight: 700,
    fontSize: '1em'
}

export const defaultItem = {
    backgroundColor: 'white',
    color: '#212529',
    fontWeight: 700,
    fontSize: '1em'
}

export const buttonProgress = {
    color: 'black',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
}

export const buttonSuccess = {
    backgroundColor: '#00800050',
    '&:hover': {
        backgroundColor: '#00800070',
    },
}

export const wrapper = {
    position: 'relative'
}

interface SelectProps {
    ID: number;
    descrip: string;
    DESCRIP: string;
    LineNum: number;
    LineDesc: string;
    ShiftID: number,
    ShiftDesc: string;
    crew_desc: any;
    MachineID: number;
    MachineDesc: string;
    EquipID: number;
    UserDescription: string;
    PackageType: number;
    Description: string;
    Syrup: number;
    Product: string;
    CrewTeamId: number;
    CrewTeamDesc: string;
    CommandString: number;
    Status: number;
    LineStateDeclaration: string;
    ApprovedReasonID: number;
    ApprovedReasonDesc: string;
    MaterialConditionID: number;
    MaterialConditionDesc: string;
    runNumber: number;
    productRun: string;
    UserId: string;
    FirstName: string;
    LastName: string;
    CO_Code: number;
    CO_Descr: string;
    CO_Std_Mins: number;
    NotificationID: number;
    NotificationDesc: string;
    RejectTypeID: number;
    RejectTypeDesc: string;
    Category: string;
    indexS: string;
    index: number,
    category: string,
    tvScreens: string,
    tvScreensInd: number,
    tZone: string,
    user: string,
    RoleDescription: string,
    RoleID: string,
    UserKey: string,
    value: number,
    WorkflowDescription: string,
    WorkflowKey: string,
    LoginName: string,
    StopCategoryDesc: string,
    eventType: string,
    itemType: string,
    itemTypeId: number,
    holdTypeDesc: string,
    holdTypeKey: string,
    lineModedesc: string,
    lineModeKey: string,
    EntityDescription: string,
    RecordKey: string,
    OperationTypeDesc : string,
    IssueTypeKey: string,
    IssueDesc: string,
    SecondaryPackageDesc: string,
    SecondaryPackageID: number,
    MarketUnitKey: string,
    SupplierKey: string
    SupplierDesc: string
    productId: number
    productKey: string
    productDesc: string
    materialKey: string
    materialDesc: string
    MarketUnitDesc: string,
    ProductID: number,
    Prod_descr: string,
    CarrierKey: string,
    CarrierDesc: string,
    BranchKey: string,
    BranchDesc: string,
    ExternalBranchKey: string,
    ExternalBranchDesc: string,
    DataCaptureModeDesc: string,
    DataCaptureModeID : number,
    ModelID : string,
    ModelDescription : string,
    CustomTransactionKey: string,
    CustomTransactionNumber: string,
    D4ARecordDescription: string,
    D4ARecordKey: string,
    FinalRootCauseID: string,
    FinalRootCauseDesc: string,
    MaterialID: string,
    MaterialDesc: string,
    CustomReportKey: string,
    CustomReportDesc: string,
    OperationKey: string,
    OperationDesc: string
}

export const SelectComponent = (props: any) => { 
    //console.log(props.options, props.name)

    return (<>
         <label htmlFor={props.label}> {translateString(props.label)}</label>
        <select
            className={props.value < 0 ? "form-control is-invalid custom-select selectComponent" : "form-control custom-select selectComponent"}
            id={props.label}
            disabled={props.disabled}
            name={props.name}
            value={props.value}
            onChange={props.handleChange}
        >

            {props.enableAll && props.label == 'Product Family' &&
                <option key={Math.random()} value={0}>{`-- ${translateString('All Product Families')} --`}</option>}
            {props.enableAll && props.label == 'Equipment' &&
                <option key={Math.random()} value={0}>{`-- ${translateString('All')} ${props.label} --`}</option>}
            {props.enableAll && props.label == 'Stop Category' &&
                <option key={Math.random()} value={0}>{`-- ${translateString('All')} --`}</option>}
            {props.enableAll && props.name == 'CustomCarriers' &&
                <option key={Math.random()} value={0}>{`-- ${translateString('All')} ${translateString(props.label)}s --`}</option>}
            {props.enableAll && ((props.name == 'CustomShippingBranches') || (props.name == 'CustomExternalBranches') || (props.name == 'CustomReceivingBranches')) &&
                <option key={Math.random()} value={0}>{`-- ${translateString('All')} ${translateString(props.label)}es --`}</option>}
            {props.enableAll && props.label != 'Equipment' && props.label != 'Stop Category' && props.label != 'Product Family' && props.label != 'Group By' && props.name != 'CustomShippingBranches' && props.name != 'CustomCarriers' && props.name != 'CustomReceivingBranches' && props.name != 'CustomExternalBranches' &&
                <option key={Math.random()} value={0}>{`-- ${translateString('All')} ${translateString(props.label)}(s) --`}</option>}
            {props.enableSelect &&
                <option key={Math.random()} value={-1}>{`-- Select ${props.label} --`}</option>}
            {props.name === 'eqstdecl' && props.options.map((stop: any) => (
                <option key={Math.random()} value={stop.index}>
                    {stop.value}
                </option>
            ))}
            {props.name.includes("productType") &&
                props.options.map((types: SelectProps) => (
                    <option key={Math.random()} value={types.ID}>
                        {types.DESCRIP}
                    </option>
                ))}
            {props.name.includes("selectedMoveType") &&
                props.options.map((types: SelectProps) => (
                    <option key={Math.random()} value={types.ID}>
                        {types.descrip}
                    </option>
                ))}   
            {props.name.includes("selectedInsertType") &&
                props.options.map((types: SelectProps) => (
                    <option key={Math.random()} value={types.ID}>
                        {types.DESCRIP}
                    </option>
                ))}  
            {props.name.includes("line") &&
                props.options.map((line: SelectProps) => (
                    <option key={Math.random()} value={line.LineNum}>
                        {line.LineDesc}
                    </option>
                ))}
            {props.name.includes("OperationKey") &&
                props.options.map((OperationKey: SelectProps) => (
                    <option key={Math.random()} value={OperationKey.OperationKey}> 
                        {OperationKey.OperationDesc}
                    </option>
                ))}
            {props.name.includes("MarketUnit") &&
                props.options.map((marketunit: SelectProps) => (
                    <option key={Math.random()} value={marketunit.MarketUnitKey}>
                        {marketunit.MarketUnitDesc}
                    </option>
                ))}
            {props.name.includes("CustomCarriers") &&
                props.options.map((customcarrier: SelectProps) => (
                    <option key={Math.random()} value={customcarrier.CarrierKey}>
                        {customcarrier.CarrierDesc}
                    </option>
                ))}
             {props.name.includes("ModelID") &&
                props.options.map((model: SelectProps) => (
                    <option key={Math.random()} value={model.ModelID}>
                        {model.ModelDescription}
                    </option>
                ))}
            {props.name.includes("CustomTransactionKey") &&
                props.options.map((customtransaction: SelectProps) => (
                    <option key={Math.random()} value={customtransaction.CustomTransactionKey}>
                        {customtransaction.CustomTransactionNumber}
                    </option>
                ))}
            {props.name.includes("CustomReportKey") &&
                props.options.map((customreport: SelectProps) => (
                    <option key={Math.random()} value={customreport.CustomReportKey}>
                        {customreport.CustomReportDesc}
                    </option>
                ))}
             {props.name.includes("CustomShippingBranches") &&
                props.options.map((customshippingbranches: SelectProps) => (
                    <option key={Math.random()} value={customshippingbranches.BranchKey}>
                        {customshippingbranches.BranchDesc}
                    </option>
                ))}
             {props.name.includes("CustomReceivingBranches") &&
                props.options.map((customreceivingbranches: SelectProps) => (
                    <option key={Math.random()} value={customreceivingbranches.BranchKey}>
                        {customreceivingbranches.BranchDesc}
                    </option>
                ))}
             {props.name.includes("Material") &&
                props.options.map((custommaterials: SelectProps) => (
                    <option key={Math.random()} value={custommaterials.MaterialID}>
                        {custommaterials.MaterialDesc}
                    </option>
                ))}
            {props.name.includes("IssueType") &&
                props.options.map((customexternalbranches: SelectProps) => (
                    <option key={Math.random()} value={customexternalbranches.D4ARecordKey}>
                        {customexternalbranches.D4ARecordDescription}
                    </option>
                ))}
            {props.name.includes("FinalRootCause") &&
                props.options.map((customfinalrootcause: SelectProps) => (
                    <option key={Math.random()} value={customfinalrootcause.FinalRootCauseID}>
                        {customfinalrootcause.FinalRootCauseDesc}
                    </option>
                ))}
            {props.name.includes("CustomExternalBranches") &&
                props.options.map((customexternalbranches: SelectProps) => (
                    <option key={Math.random()} value={customexternalbranches.ExternalBranchKey}>
                        {customexternalbranches.ExternalBranchDesc}
                    </option>
                ))}
            {props.name.includes("declaration") &&
                props.options.map((declaration: SelectProps) => (
                    <option key={Math.random()} value={declaration.Status}>
                        {declaration.LineStateDeclaration}
                    </option>
                ))}
            {props.name.includes("approved") &&
                props.options.map((approvedReason: SelectProps) => (
                    <option key={Math.random()} value={approvedReason.ApprovedReasonID}>
                        {approvedReason.ApprovedReasonDesc}
                    </option>
                ))}
            {props.name.includes("crew") &&
                props.options.map((crew: SelectProps) => (
                    <option key={Math.random()} value={crew.CrewTeamId}>
                        {crew.CrewTeamDesc}
                    </option>
                ))}
            {props.name.includes("shift") && props.options.map((shift: SelectProps) => (
                <option key={Math.random()} value={shift.ShiftID}>
                    {shift.ShiftDesc}
                </option>
            ))}

            {props.name.includes("equipment") && props.options.map((equipment: SelectProps) => (
                <option key={Math.random()} value={equipment.MachineID}>
                    {equipment.MachineDesc}
                </option>
            ))}

            {props.name.includes("package") && props.name !== "secondaryPackage" && props.options.map((package1: SelectProps) => (
                <option key={Math.random()} value={package1.PackageType}>
                    {package1.Description}
                </option>
            ))}

            {props.name.includes("flavor") && props.options.map((flavor: SelectProps) => (
                <option key={Math.random()} value={flavor.Syrup}>
                    {flavor.Product}
                </option>
            ))}

            {props.name.includes("materialCondition") && props.options.map((materialCondition: SelectProps) => (
                <option key={Math.random()} value={materialCondition.MaterialConditionID}>
                    {materialCondition.MaterialConditionDesc}
                </option>
            ))}

            {props.name.includes("productInfo") && props.options.map((product: SelectProps) => (
                <option key={Math.random()} value={product.runNumber}>
                    {product.productRun}
                </option>
            ))}
            {props.name.includes("notification") && props.options.map((notification: SelectProps) => (
                <option key={Math.random()} value={notification.NotificationID}>
                    {notification.NotificationDesc}
                </option>
            ))}
            {props.name.includes("users") && props.options.map((user: SelectProps) => (
                <option key={user.UserId} value={user.UserId}>
                    {user.FirstName} {user.LastName}
                </option>
            ))}

            {props.name.includes("changeover") && props.options.map((changeover: SelectProps) => (
                <option key={Math.random()} value={changeover.CO_Code}>
                    {changeover.CO_Descr + ' (' + changeover.CO_Std_Mins + ' mins)'}
                </option>
            ))}

            {props.name.includes("reject") && props.options.map((reject: SelectProps) => (
                <option key={Math.random()} value={reject.RejectTypeID}>
                    {reject.RejectTypeDesc}
                </option>
            ))}

            {props.name.includes("orderBy") &&
                (<><option key={Math.random()} value="none">{translateString("None")}</option>
                    <option key={Math.random()} value="hour">{translateString("Hour")}</option>
                    <option key={Math.random()} value="day">{translateString("Day")}</option>
                    <option key={Math.random()} value="week">{translateString("Week")}</option>
                    <option key={Math.random()} value="month">{translateString("Month")}</option>
                    <option key={Math.random()} value="quarter">{translateString("Quarter")}</option>
                    <option key={Math.random()} value="year">{translateString("Year")}</option></>)}

            {props.name.includes("group") &&
                (<><option key={Math.random()} value="hour">{translateString("Hour")}</option>
                    <option key={Math.random()} value="day">{translateString("Day")}</option>
                    <option key={Math.random()} value="week">{translateString("Week")}</option></>)}

            {props.name.includes("message") &&
                (<><option key={Math.random()} value={25}>25</option>
                    <option key={Math.random()} value={50}>50</option>
                    <option key={Math.random()} value={75}>75</option>
                    <option key={Math.random()} value={100}>100</option>
                    <option key={Math.random()} value={125}>125</option></>)}
            {/* {props.name.includes("stop") &&
                (<><option key={Math.random()} value="-1">{translateString("All Stop Types")}</option>
                    <option key={Math.random()} value="1">{translateString("Automatic Stops")}</option>
                    <option key={Math.random()} value="0">{translateString("Manual Stops")}</option></>)} */}
            {/* {props.name === 'declaration' &&
                (<> <option key={Math.random()} value="0">{translateString("Operator stops")}</option>
                    <option key={Math.random()} value="1">{translateString("Declared stops")}</option>
                    <option key={Math.random()} value="2">{translateString("UnDeclared stops")}</option></>)} */}

            {props.name.includes("searchCategory") &&
                props.options.map((search: SelectProps) => (
                    <option key={Math.random()} value={search.indexS}>
                        {translateString(search.Category)}
                    </option>
                ))}

            {props.name.includes("category") &&
                props.options.map((search: SelectProps) => (
                    <option key={Math.random()} value={search.index}>
                        {search.category}
                    </option>
                ))}

            {props.name.includes("GroupBy") &&
                props.options.map((search: SelectProps, index: number) => (
                    <option key={Math.random()} value={index}>
                        {search.value}
                    </option>
                ))}

            {props.name.includes("StopCategory") &&
                props.options.map((search: SelectProps) => (
                    <option key={Math.random()} value={search.Category}>
                        {search.StopCategoryDesc}
                    </option>
                ))}
            {/* [AL 02/10/20] -drop down for adding tv screen */}
            {props.name.includes("tvScreens") &&
                props.options.map((search: SelectProps) => (
                    <option key={Math.random()} value={search.tvScreensInd}>
                        {search.tvScreens}
                    </option>
                ))}
            {/* [AL 02/13/20] -drop down for Time Zone */}
            {props.name.includes("TimeZone") &&
                props.options.map((TZone: SelectProps) => (
                    <option key={Math.random()} value={TZone.index}>
                        {TZone.tZone}
                    </option>
                ))}
            {/* [AL 04/22/2020] -- clockInOut screen */}
            {props.name.includes("UserKey") &&
                props.options.map((search: SelectProps) => (
                    <option key={Math.random()} value={search.UserKey}>
                        {search.user}
                    </option>
                ))}
            {props.name.includes("roleKey") &&
                props.options.map((search: SelectProps) => (
                    <option key={Math.random()} value={search.RoleID}>
                        {search.RoleDescription}
                    </option>
                ))}
            {props.name.includes("deleted") &&
                props.options.map((search: SelectProps) => (
                    <option key={Math.random()} value={search.index}>
                        {search.value}
                    </option>
                ))}
            {props.name.includes("manuallyAdded") &&
                props.options.map((search: SelectProps) => (
                    <option key={Math.random()} value={search.index}>
                        {search.value}
                    </option>
                ))}
            {props.name.includes("punchTypeID") &&
                props.options.map((search: SelectProps) => (
                    <option key={Math.random()} value={search.index}>
                        {search.value}
                    </option>
                ))}
            {props.name.includes("userID") &&
                props.options.map((userID: SelectProps) => (
                    <option key={Math.random()} value={userID.UserId}>
                        {userID.LoginName}
                    </option>
                ))}
            {props.name.includes("workflow") &&
                props.options.map((workflow: SelectProps) => (
                    <option key={Math.random()} value={workflow.WorkflowKey}>
                        {workflow.WorkflowDescription}
                    </option>
                ))}
            {props.name.includes("step") &&
                (<><option key={Math.random()} value="Assigned">{translateString("Assigned")}</option>
                    <option key={Math.random()} value="Completed">{translateString("Completed")}</option>
                    <option key={Math.random()} value="Pending">{translateString("Pending")}</option>
                    <option key={Math.random()} value="Unclaimed">{translateString("Unclaimed")}</option></>)}
            {props.name.includes("eventType") &&
                props.options.map((eventType: SelectProps) => (
                    <option key={Math.random()} value={eventType.value}>
                        {eventType.value}
                    </option>
                ))}
            {props.name.includes("entity") &&
                props.options.map((entity: SelectProps) => (
                    <option key={Math.random()} value={entity.RecordKey}>
                        {entity.EntityDescription}
                    </option>
                ))}
            {props.name.includes("itemType") &&
                props.options.map((itemType: SelectProps) => (
                    <option key={Math.random()} value={itemType.itemTypeId}>
                        {itemType.itemType}
                    </option>
                ))}
            {props.name.includes("holdType") &&
                props.options.map((holdType: SelectProps) => (
                    <option key={Math.random()} value={holdType.holdTypeKey}>
                        {holdType.holdTypeDesc}
                    </option>
                ))}
            {props.name === "LMode" &&
                props.options.map((lMode: SelectProps) => (
                    <option key={Math.random()} value={lMode.lineModeKey}>
                        {lMode.lineModedesc}
                    </option>
                ))}
            {props.name === "IssueType" &&
                props.options.map((it: SelectProps) => (
                    <option key={it.IssueTypeKey} value={it.IssueTypeKey}>
                        {it.IssueDesc}
                    </option>
                ))}
            {props.name === "secondaryPackage" &&
                props.options.map((sPkg: SelectProps) => (
                    <option key={Math.random()} value={sPkg.SecondaryPackageID}>
                        {sPkg.SecondaryPackageDesc}
                    </option>
                ))}
            {props.name === "supplier" &&
                props.options.map((su: SelectProps) => (
                    <option key={su.SupplierKey} value={su.SupplierKey}>
                        {su.SupplierDesc}
                    </option>
                ))}
            {props.name === "productId" &&
                props.options.map((prod: SelectProps) => (
                    <option key={prod.productKey} value={prod.productId}>
                        {prod.productDesc}
                    </option>
                ))}
            {props.name === "materialType" &&
                props.options.map((mt: SelectProps) => (
                    <option key={mt.materialKey} value={mt.materialKey}>
                        {mt.materialDesc}
                    </option>
                ))}
            {props.name.includes("dataType") &&
                (<><option key={Math.random()} value="integer">Integer</option>
                    <option key={Math.random()} value="decimal">Decimal</option>
                    <option key={Math.random()} value="text">Text</option></>
                )}
            { props.name.includes("operationType") &&
            props.options.map((operationType: SelectProps) => (
                <option key={Math.random()} value={operationType.value}>
                    {operationType.OperationTypeDesc}
                </option>
            ))} 
            {props.name === "selectedProduct" &&
            props.options.map((selectedProduct: SelectProps) => (
                <option key={Math.random()} value={selectedProduct.ProductID}>
                    {selectedProduct.Prod_descr}
                </option>
            ))}  
             {props.name === "dataCaptureModeID" &&
            props.options.map((dataCaptureMode: SelectProps) => (
                <option key={Math.random()} value={dataCaptureMode.DataCaptureModeID}>
                    {dataCaptureMode.DataCaptureModeDesc}
                    </option>
            ))} 
            {props.name === "dataCaptureMode" &&
            props.options.map((DCM: SelectProps) => (
                <option key={DCM.DataCaptureModeDesc + DCM.DataCaptureModeID} value={DCM.DataCaptureModeID}>
                    {DCM.DataCaptureModeDesc}
                </option>
            ))}  
        </select>
    </>)

}

export const DateTimeComponent = (props: any) => {
    const [clearedDate, handleClearedDateChange] = useState(null);
    const [selectedDate, handleDateChange] = useState(props.value);//new Date("2019-01-01T18:54)"
    // console.log('value=',props.value, selectedDate)
    return (
        <div className="selectDateTime">
            {/* <label htmlFor={props.label} style={{ display: 'inline-block' }}>{props.label}</label> */}
            <label className="dateTimeLabel" htmlFor={props.label}>{translateString(props.label)}</label> 
            {/* ------------------this label is important for reusable component, DO NOT comment out------------------- */}
            <ThemeProvider theme={defaultMaterialTheme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDateTimePicker
                    //variant="inline"
                    inputVariant="outlined"
                    // value={selectedDate}
                    value = {props.value}
                    ampm={false}
                    //onChange={handleDateChange}
                    onChange={props.handleChange}
                    //label="Keyboard with error handler"
                    onError={console.log}
                    //minDate={new Date("2018-01-01T00:00")}
                    format="YYYY/MM/DD HH:mm:ss"
                />
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </div>
    )
}

export const DateComponent = (props: any) => {
    return (
        <div className="selectDate">
            <label className="dateLabel" htmlFor={props.label}>{translateString(props.label)}</label>
            <ThemeProvider theme={defaultMaterialTheme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                        className="dateValue"
                        variant="inline"
                        autoOk
                        inputVariant={props.inputVariant === undefined ? "outlined" : props.inputVariant}
                        value={props.value}
                        onChange={props.handleChange}
                        onError={console.log}
                        maxDate={props.maxDate || new Date('2100/01/01')}
                        minDate={props.minDate || new Date('1900/01/01')}
                        format={props.format}
                    />
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </div>
    )
}

export const TimeComponent = (props: any) => {
    return <div className="selectTime">
        <label className="timeLabel" htmlFor={props.label}>{translateString(props.label)}</label>
        <ThemeProvider theme={defaultMaterialTheme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardTimePicker
                    className="timeValue"
                    variant="inline"
                    inputVariant="outlined"
                    ampm={false}
                    value={props.value}
                    onChange={props.handleChange}
                    onError={console.log}
                    // maxDate={props.maxDate || new Date('2100/01/01')}
                    // minDate={props.minDate || new Date('1900/01/01')}
                    format={props.format}
                    keyboardIcon={<AlarmIcon />}
                />
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    </div>
}

/** [MD: 8/21/2020] - Method used for taking out special characters in a string to avoid invalid chars in an API call (query) 
 *  @param str: the string to modify
*/
export const replaceSpChar = (str: string) => {
    let newStr = str.replace("'", "''");

    return newStr;
}

export const captureInfo = async () => {
    let email: string = "";
    let userIDFromAxiosCall: string = "";
    let lineNumber: number = 0;
    const fetchInactive = 0;
    let server = !isNullOrUndefined(localStorage.getItem('servername')) ? localStorage.getItem('servername') : ""
    //Fetching userID and lineNumber from axios call on page refresh or reload
    if (!isNullOrUndefined(localStorage.userID)) {
        userIDFromAxiosCall = localStorage.userID
    }
    let lineRes = await axios.get(`${server}/api/lines/${fetchInactive}`)
    if (lineRes.status === 200 && lineRes.data.length > 0) {
        lineNumber = lineRes.data[0].LineNum;
    }
    return { userIDFromAxiosCall, lineNumber };
}

//[NT: 6/31/2020] - convert array buffer to base64
export const bufferToBase64 = (buffer) => {
    var binstr = Array.prototype.map.call(buffer, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
};

//[NT: 6/31/2020] - open a file in a new page
export const inspectDocument = (buffer, isImage: boolean) => {
    const win = window.open("", "_blank");
    let binstr = bufferToBase64(buffer);
    let html = '';
    if (!isImage) {
        html += '<html>';
        html += '<body style="margin:0!important">';
        html += '<embed width="100%" height="100%" src="data:application/pdf;base64,' + binstr + '" type="application/pdf" target="_blank"/>';
        html += '</body>';
        html += '</html>';
    }
    else {
        html += '<html>';
        html += '<body style="margin:0!important">';
        html += '<img width="100%" height="100%" src="data:image/*;base64,' + binstr + '" type="image/*" target="_blank"/>';
        html += '</body>';
        html += '</html>';
    }

    if (win !== null) {
        win.document.write(html);
    }
};

//[NT: 6/31/2020] - return Data URL
export const convertBufferArrayToDataURL = (arrayData: any, type = "image/png") => {
    const arrayBuffer = new Uint8Array(arrayData);
    const blob = new Blob([arrayBuffer], { type: type });
    const urlCreator = window.URL || (window as any).webkitURL;
    const fileUrl = urlCreator.createObjectURL(blob);
    return fileUrl;
};

//[MD: 9/17/2020] Convert File to Base64
export const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

//[NT: 6/31/2020] - Use this method for downloading file with an array buffer.
export const createAndDownloadFile = (body, filename, extension) => {
    const binstr = bufferToBase64(body);
    const fileName = `${filename}${extension}`;
    const link = document.createElement('a');
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
        link.setAttribute('href', `data:application/${extension};base64, ${binstr}`);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// export const Slider = (props: any) => {

//     return (
//         <>
//             {/* <label htmlFor={props.label} style={{ display: 'inline-block' }}>{props.label}</label> */}
//             <input id={props.line} type="range"
//                 className="range"
//                 value={props.value}
//                 min={props.min}
//                 max={props.max}
//                 step={props.step}
//                 onChange={props.handleChange}
//             />
//             <span id="output">{props.value}</span>
//         </>
//     )
// }

/** [XQ: 1/20/2020] - This method is to convert charts to pdf and print in landscape 
 *  @param classNames: a list of charts
 *  @param chartsPerpage: define how many charts in a page
 *  @param filename: name of the pdf file
*/
export function convertToPdf(classNames: any, chartsPerpage: number, filename: string) {
    const pdf = new pdfConverter('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
    const pdfHeight = pdf.internal.pageSize.getHeight() - 15;
    let y_pos: number = 10;
    if (classNames.length > 0) {
        classNames.forEach((d: any, i: number) => {
            const curElement: any = window.document.getElementsByClassName(`${d}`)[0];
            if (curElement) {
                html2canvas(curElement)
                    .then(canvas => {
                        const img_data = canvas.toDataURL('image/png');
                        const imgProps = pdf.getImageProperties(img_data);
                        const curHeight = Math.min(
                            (imgProps.height * (pdfWidth + 20)) / imgProps.width + 10,
                            pdfHeight / chartsPerpage
                        );
                        const isPie: boolean = String(d).toLowerCase().includes('pie');
                        const imgWidth_pdf = (imgProps.width * curHeight) / imgProps.height;
                        const curWidth = isPie && imgProps.width < 700 ? curHeight + 10 :
                            (!isPie ? (imgWidth_pdf < pdfWidth ?
                                (imgWidth_pdf < pdfWidth / 2 ?
                                    pdfWidth / 2 : imgWidth_pdf) : pdfWidth) : pdfWidth);
                        let x_pos: number = 0;
                        //[XQ: 2/5/2020] - special case for line rejects
                        if (filename.toLowerCase().includes('linerejects')) {
                            x_pos = chartsPerpage > 1 ?
                                (isPie ? (imgWidth_pdf < pdfWidth / 2 || imgWidth_pdf < pdfWidth - 100 ?
                                    pdfWidth / 3 + 10 : pdfWidth / 4) :
                                    (imgWidth_pdf < pdfWidth / 2 || imgWidth_pdf < pdfWidth - 100 ?
                                        pdfWidth / 4 : 12)) : 12;
                        } else {
                            x_pos = chartsPerpage > 1 ? (isPie ? pdfWidth / 4 : (imgWidth_pdf < pdfWidth / 2 ? pdfWidth / 4 : 12)) : 12;
                        }
                        if (i % chartsPerpage === 0 && i !== 0) {
                            pdf.addPage();
                            y_pos = 10;
                        }
                        if (classNames.length === 1 || chartsPerpage === 1) {
                            y_pos = (pdfHeight - curHeight) / 2;
                        }
                        pdf.addImage(
                            img_data,
                            'PNG',
                            x_pos,
                            y_pos,
                            chartsPerpage > 1 ? (!isPie ? curWidth : curWidth / 2 + 20) : curWidth,
                            isPie ? curHeight - 20 : curHeight
                        );
                        y_pos = y_pos + curHeight;
                        if (i === classNames.length - 1) {
                            pdf.autoPrint();
                            pdf.save(`${filename}.pdf`);
                        }
                    })
                    .catch(err => console.log(err));
            }
        });
    } else {
        alert('Please select charts');
    }
}



const StyledTable = (props: any) => {
    const TableCell1 = withStyles({
        root: {
            borderBottom:"none"
        }
    })(TableCell)
    return (
        <React.Fragment>
            {props.columns.length > 0 && 
            <Paper style={{ border: 'none', boxShadow: '2px 2px 10px 2px rgb(136, 136, 136, 0.25)', borderRadius: '5px' }}>
                <Typography variant='h6' id="tableTitle" 
                    style={{ 
                        padding: '8px 8px', 
                        // fontFamily: 'Verdana,sans-serif',
                        fontWeight: 400,
                        backgroundColor:'var(--primary-color)',
                        color:'white'
                    }}>
                </Typography>
                <Table size="small" component="div" style={{ display: 'block'}} >
                    <TableHead component="div" style={{ display: 'block', backgroundColor: '#e0e1e2'}}>
                        <TableRow component="div" style={{ display: 'flex', height: "auto"}}>
                            {props.columns.map((row: any, idx: number) => (
                                idx === 0 ? 
                                <TableCell key={Math.random()} 
                                    component="div"
                                    align="center"
                                    style={{ 
                                        // display: 'block',
                                        width: props.changeWidth ? (idx === 0 ? `${props.changeWidthVal}%` : `${(100 - props.changeWidthVal) / (props.columns.length - 1)}%`) : `${100/props.columns.length}%`,
                                        flexShrink: 0,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        // color: 'rgba(0,0,0,.8)',
                                        height:"auto",
                                        // textAlign:"right"
                                        verticalAlign: 'middle'
                                        // fontFamily: 'Verdana,sans-serif',
                                    }}
                                >{translateString(row.title)}</TableCell> : 
                                <TableCell key={Math.random()}
                                    component="div"
                                    align="center"
                                    style={{
                                        // display: 'block',
                                        width: props.changeWidth ? `${(100 - props.changeWidthVal) / (props.columns.length - 1)}%` : `${100/props.columns.length}%`,
                                        flexGrow: 1,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        // color: 'rgba(0,0,0,.8)',
                                        height:"auto",
                                        verticalAlign: 'middle'
                                        // fontFamily: 'Verdana,sans-serif',
                                    }}
                                >{translateString(row.title)}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody className="tableBody" component="div"
                        style={{ display:"block",  height: props.height, overflow: 'scroll'}}
                    >
                        {props.data.length > 0 ? props.data.map((d: any, d_idx: number) => (
                            <TableRow key={Math.random()} component="div"
                                style={{
                                    display: 'flex',
                                    fontSize: '0.9rem',
                                    // fontFamily: 'Verdana,sans-serif',
                                    backgroundColor: d_idx % 2 !== 0 ? '#e0e1e2' : 'white',
                                    // justifyContent: 'center',
                                    height: "auto",
                                    alignItems:"center",
                                    // minHeight:"35px",
                                                                      
                                }}
                            >
                                {props.columns.map((col: any, index: number) => (
                                    index === 0 ? <TableCell1 key={Math.random()} align="center" padding="default" style={{
                                        // display: 'block',
                                        // width: props.changeWidth ? (index === 0 ? `${props.changeWidthVal}%` : `${(100 - props.changeWidthVal) / (props.columns.length - 1)}%`) : `${100/props.columns.length}%`,
                                        width: props.changeWidth ? (index === 0 ? `${props.changeWidthVal}%` : `${(100 - props.changeWidthVal) / (props.columns.length - 1)}%`) : `${100/props.columns.length}%`,
                                        flexGrow: 1,
                                        height: "auto",
                                        flexShrink: 0,
                                        fontSize: '0.9rem',
                                        // display:"table-cell",
                                        textAlign:"center",
                                        verticalAlign:"middle",
                                        
                                        // minHeight:"85px",
                                        // text-align: "center";
                                        // vertical-align: middle
                                        // verticalAlign:"middle",
                                        
                                        // fontFamily: 'Verdana,sans-serif',

                                    }}>{d[col.field]}</TableCell1> : 
                                    <TableCell1 key={Math.random()} align="center" padding="default" style={{
                                        // display: 'block',
                                        // width: props.changeWidth ? `${(100 - props.changeWidthVal) / (props.columns.length - 1)}%` : `${100/props.columns.length}%`,
                                        width: props.changeWidth ? (index === 0 ? `${props.changeWidthVal}%` : `${(100 - props.changeWidthVal) / (props.columns.length - 1)}%`) : `${100/props.columns.length}%`,
                                        flexGrow: 1,
                                        height: "auto",
                                        flexShrink: 0,
                                        fontSize: '0.9rem',
                                        verticalAlign:"middle",
                                        // minHeight:"35px",
                                        textAlign:"center",
                                        // fontFamily: 'Verdana,sans-serif',
                                       
                                    }}>{d[col.field]}</TableCell1>
                                ))}
                            </TableRow>
                        )) : 
                        <TableRow key={Math.random()} component="div" style={{
                            display: 'flex',
                            fontSize: '1rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: '1rem',
                            // fontFamily: 'Verdana,sans-serif',
                            // alignContent:'center', alignItems:'center'
                        }}>
                            No Records
                        </TableRow>}
                    </TableBody>
                </Table>
            </Paper>}
        </React.Fragment>
    );
}



/** [MD: 07/23/2020]
* Props to use: equipmentDetails, equipmentParameters, labEquipmentKey and isEditable
* Component for now is only used in the L4A calibration pages, may have to make it more flexible if necessary for future pages.
*/
export const EquipmentCalibrationInfoPanel = (props: any) => {
    console.log(props.equipmentParameters)
    let styledTableColumn = [
        { title: 'Calibration Parameters', field: 'ParameterDesc', editable: 'never', },
        { title: 'Min', field: 'MinValue', editable: 'never', },
        { title: 'Max', field: 'MaxValue', editable: 'never'}
        //{ title: 'Cases Req', field: 'casesReq', editable: 'never', cellStyle: { padding: '0px 10px', height: '30px' } }
    ]
    let equipmentDetails = new Array()
    let equipmentParameters = new Array()
    for(let i=0; i<props.equipmentDetails.length; i++) {
        equipmentDetails.push(Object.assign({}, props.equipmentDetails[i]))
    }
    for(let i=0; i<props.equipmentParameters.length; i++) {
        equipmentParameters.push(Object.assign({}, props.equipmentParameters[i]))
    }
    for(let i=0; i<equipmentDetails.length; i++) {
        if(isNullOrUndefined(equipmentDetails[i].AssetSerialNum) || equipmentDetails[i].AssetSerialNum === "") {
            equipmentDetails[i].AssetSerialNum = "-"
        }
        if(isNullOrUndefined(equipmentDetails[i].CalibrationFrequency_Hours)) {
            equipmentDetails[i].CalibrationFrequency_Hours = "-"
        }
    }
    for(let i=0; i<equipmentParameters.length; i++) {
        if(isNullOrUndefined(equipmentParameters[i].ParameterDesc) || equipmentParameters[i].ParameterDesc === "") {
            equipmentParameters[i].ParameterDesc = "-"
        }
        if(isNullOrUndefined(equipmentParameters[i].MinValue)) {
            equipmentParameters[i].MinValue = "-"
        }
        if(isNullOrUndefined(equipmentParameters[i].MaxValue)) {
            equipmentParameters[i].MaxValue = "-"
        }
    }
    return (
        <Paper style={{ border: '1px solid rgba(0, 0, 0, .125)', width: '100%', backgroundColor: 'white' }}>
            <Box display="flex" justifyContent="space-evenly">
                <Box m={2} display="flex" flexDirection="column" alignItems="center">
                    {props.equipmentDetails.length <= 0 &&
                        <Typography variant="h6" key={Math.random()} style={{ fontWeight: 'bold' }}>{translateString("Machine Name")}</Typography>}
                    {props.equipmentDetails.map((value: any) => {
                        return (
                            <div key={Math.random()}>
                                <Typography variant="h6" key={Math.random()} style={{ fontWeight: 'bold' }}>{value.LabEquipmentDescription}</Typography>
                                {value.RenderedPicture !== '' ? (
                                    <img
                                        key={Math.random()}
                                        src={value.RenderedPicture}
                                        width={110}
                                        height={96} />) : (
                                            <><br />
                                            <label style = {{color:"rgb(211,211,211)"}}>No Picture Found</label></>
                                        )}
                            </div>
                        )   
                    })}
                </Box>
                <Box m={2} display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>{translateString("Asset Serial Number")}</Typography>
                    {props.equipmentDetails.map((value: any) => {
                        return (
                            <Box key={Math.random()} p={1} minWidth={125} border="1px solid rgba(0, 0, 0, .125)" borderRadius="2px">
                                {/* <Typography>{value.AssetSerialNum}</Typography> */}
                                <input className="form-control text-center font-weight-bold" disabled
                                                value={!isNullOrUndefined(value.AssetSerialNum) ? value.AssetSerialNum : "-"} />
                            </Box>
                        )
                    })}
                </Box>
                <Box m={2} display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>{translateString("Calibration Frequency in Hours")}</Typography>
                    {props.equipmentDetails.map((value: any) => {
                        return (
                            <Box key={Math.random()} p={1} minWidth={125} border="1px solid rgba(0, 0, 0, .125)" borderRadius="2px">
                                {/* <Typography>{value.CalibrationFrequency_Hours}</Typography> */}
                                <input className="form-control text-center font-weight-bold" disabled
                                                value={!isNullOrUndefined(value.CalibrationFrequency_Hours) ? value.CalibrationFrequency_Hours : "-"} />
                            </Box>
                        )
                    })}
                </Box>
                {!isNullOrUndefined(props.equipmentParameters) && props.equipmentParameters.length !== 0 && 
                    <Box m={2} display="flex" flexDirection="column">
                        <StyledTable 
                            columns={styledTableColumn}
                            data={equipmentParameters}
                            // height="650px"
                            headRowHeight="50px"
                            bodyRowHeight="43px"
                            changeWidth={true}
                            changeWidthVal={40}
                            title={"Production Line Status"}
                        />
                    </Box>}
                {/* <Box m={2} display="flex" flexDirection="column">
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>{translateString("Calibration Parameters")}</Typography>
                    {props.equipmentParameters.map((value: any) => {
                        return (
                            <Box key={Math.random()} p={1} minWidth={125} border="2px solid rgba(0, 0, 0, .125)" borderRadius="5px">
                                <Typography>{value.ParameterDesc}</Typography>
                            </Box>
                        )
                    })}
                </Box>
                <Box m={2} display="flex" flexDirection="column">
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>{translateString("Min - Max")}</Typography>
                    {props.equipmentParameters.map((value: any) => {
                        if (value.DataType.toLowerCase() === "integer" || value.DataType.toLowerCase() === "decimal") {
                            return (
                                <Box key={Math.random()} display="flex" justifyContent="space-around" borderRadius="5px">
                                    <Box p={1} minWidth={125} border="2px solid rgba(0, 0, 0, .125)">
                                        <Typography>{value.MinValue}</Typography>
                                    </Box>
                                    <Box p={1} minWidth={125} border="2px solid rgba(0, 0, 0, .125)" borderRadius="5px">
                                        <Typography>{value.MaxValue}</Typography>
                                    </Box>
                                </Box>
                            )
                        }
                        else {
                            return undefined;
                        }
                    })}
                </Box> */}
                {props.isEditable &&
                    <Box display="flex" justifyContent="flex-end">
                        <Box m={1}>
                            <Tooltip title={translateString("Edit Equipment")}>
                                <Fab size="small" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }} onClick={() => props.editEquipment()}>
                                    <Edit />
                                </Fab>
                            </Tooltip>
                        </Box>
                    </Box>}
            </Box>
        </Paper>
    )
}

// //[AL:1-28-2020]--add screenshot to capture currentpage component (only able to store link on current computer)
// export function screenshot(e: any) {
//     html2canvas(document.body).then(function(canvas){
//         try{
//             localStorage.setItem("screenShot",canvas.toDataURL("screnShot/png"))
//             console.log("Screenshot took, store locally")
//             // return(<div> { document.body.appendChild(canvas)}</div>)
//         }
//         catch(e){
//             console.log("screenShot failed to store "+e)
//         }
//     }).catch(err => console.log("ScreenShot failed "+err))
// }


/** [DJ: 5/5/2020] - This method looks up the string passed to it in the translation lookup 
 * list and returns the term assigned to it in a function format.
 */
export function translateString(stringToBeTranslated: string, isToUpper: boolean = false) {
    //console.log(newStore.getState(), stringToBeTranslated, 'testing the store')
    let server = (localStorage.getItem('servername') === null || localStorage.getItem('servername') === undefined) ? "" : localStorage.getItem('servername');
    const userId = !isNullOrUndefined(localStorage.getItem('userID')) ? localStorage.userID : "";
    const appStateStr: string = localStorage.getItem('appState') ? localStorage.appState : '';
    const languageId: number = appStateStr === '' ? 1 : Number(JSON.parse(appStateStr)['LanguageID']);
    let storeState = newStore.getState();
    let trimmedComparator = !isNullOrUndefined(stringToBeTranslated) ? stringToBeTranslated.toString().trim() : "";
    let translatedTerm: string = stringToBeTranslated
    
    if (trimmedComparator.length > 0) {
        let index = storeState.translationList.findIndex((item: any) => {
            return (item.RootItem.toLowerCase() === trimmedComparator.toLowerCase())
        })
        if (index !== -1) {
            translatedTerm = storeState.translationList[index].TranslationItem
        } else {
            //The root translation does not exist in the database. Add it.
            let apiCall: any = {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({RootItem: trimmedComparator}),
                url: server + "/api/addRootTranslation"
            };

            axios(apiCall)
            .then(res => {
                if(res.status === 200) {
                    axios.get(server + "/api/getTranslationList/" + languageId)
                    .then(res => {
                        newStore.dispatch(actions.setTranslationList([...res.data]));
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        }
    }
    return isToUpper ? translatedTerm.toUpperCase() : translatedTerm;
}


/** [DJ: 4/21/2020] - This component looks up the string passed to it in the translation lookup 
 * list and returns the term assigned to it in a component format
 */

class StringReplacer extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            translatedItem: ""
        }
    }

    componentDidMount() {
        this.handleTranslation()
        //console.log(this.props)
    }

    componentDidUpdate(prevProps) {
        if (this.props.children !== prevProps.children) {
            this.handleTranslation()
        }
    }

    handleTranslation() {
        const children: any = this.props.children;
        let server = (localStorage.getItem('servername') === null || localStorage.getItem('servername') === undefined) ? "" : localStorage.getItem('servername');
        let userID = (localStorage.getItem('userID') === null || localStorage.getItem('userID') === undefined) ? "" : localStorage.getItem('userID');

        let languageID: string = this.props.LanguageID;
		const appStateStr = localStorage.getItem("appState") ? localStorage.getItem("appState") : '';
		const appState: any[] = appStateStr ? JSON.parse(appStateStr) : [];
		if(appState && appState.length> 0) {
			languageID = appState['LanguageID'];
		}

        let trimmedComparator = !isNullOrUndefined(children) ? children.toString().trim() : "";
        if (trimmedComparator.length > 0) {
            let index = this.props.translationList.findIndex((item: any) => {
                return (item.RootItem.toLowerCase() === trimmedComparator.toLowerCase())
            })
            if (index !== -1) {
                let translatedTerm = this.props.translationList[index].TranslationItem
                this.setState({
                    translatedItem: translatedTerm
                })
            } else {
                //The root translation does not exist in the database. Add it.
                let apiCall: any = {
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    data: qs.stringify({RootItem: trimmedComparator}),
                    url: server + "/api/addRootTranslation"
                };
    
                axios(apiCall)
                .then(res => {
                    if(res.status === 200) {
                        axios.get(server + "/api/getTranslationList/" + languageID)
                        .then(res => {
                           newStore.dispatch(actions.setTranslationList([...res.data]));
                        })
                        .catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));
            }
        }
    }


    render() {
        let resString = this.state.translatedItem.length > 0 ? this.state.translatedItem : this.props.children
        resString = this.props.isToUpper ?  resString.toUpperCase() : resString
        
        return (<span>{resString}</span>);
    } 
}

function mapStateToProps(state: AppState) {
    return {
        systemDefinition: state.systemDefinition,
        translationList: state.translationList,
        LanguageID: state.LanguageID
    };
}

function mapDispatchToProps(dispatch: Dispatch<actions.KnownAction>) {
	return {
		receiveData: (LanguageID: number, email: string, server: any) => dispatch(actions.receiveData(LanguageID, email, server)),
	};
}

let StringReplacerConnector: any = connect(mapStateToProps, mapDispatchToProps)(StringReplacer);
export { StringReplacerConnector as StringTranslator }

const color: any = localStorage.getItem('secondary-color')
/** [DJ: 6/17/2020] -Creating a timeline for playback functionality */
const StyledSlider = withStyles({
    root: {
        color: color,
        height: 7
    },
    thumb: {
        width: 12,
        height: 12
    },
    active: {},
    track: {
        height: 5
    },
    rail: {
        height: 5,
        opacity: .18
    },
    valueLabel: {
        top: -14,
        "& *": {
            backgroundColor: "transparent",
            color: color,
            fontWeight: 'bold',
            fontSize: 14
        }
    }
})(Slider);


let sliderValue: number = 0
let curSliderValue: number = 0
let intervalTimer, noDataTimeout
export class TimeLine extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        let updatedStartDate = Moment(new Date()).subtract(1, 'h').format("MM-DD-YYYY hh:mm:ss A")
        // const updatedStartDate = Moment(new Date('06-22-2020')).format("MM-DD-YYYY hh:mm:ss A")
        this.state = {
            startDate: updatedStartDate,
            //endDate: Moment(updatedStartDate).add(1, 'h').format("MM-DD-YYYY hh:mm:ss A"),
            endDate: new Date(),
            currTimeStamp: Moment(new Date()).format("MM-DD-YYYY hh:mm:ss A"),
            timeStampSlider: 0,
            scale: 0,
            isLoading: false,
            playback: true
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        if (this.props.currentPosition !== prevProps.currentPosition) {
            this.setScale()
        }
    }

    componentWillUnmount() {
        clearInterval(intervalTimer)
        clearTimeout(noDataTimeout)
    }


    setScale() {
        const { startDate, endDate, currTimeStamp } = this.state
        const { dataLog, frames, currentFrame } = this.props
        const numberOfFrames = Object.keys(frames).length

        if (currentFrame && currentFrame.length > 0) {
            const frameTimeStampRaw = currentFrame[0].InsertDateTime
            const updatedTimeStamp = new Date(Moment.parseZone(frameTimeStampRaw).format('MM-DD-YYYY hh:mm:ss A'))

            this.setState({
                currTimeStamp: updatedTimeStamp
            })

        }
        if (this.state.scale !== numberOfFrames) {
            if (noDataTimeout) {
                console.log("nodatatimeout")
                clearTimeout(noDataTimeout)
                noDataTimeout = null
            }
            this.setState({
                scale: numberOfFrames - 1,
                isLoading: false,
            })
        }

    }

    onSearchClick(startDate, endDate) {

        const formattedStartDate = Moment(startDate).format('MM-DD-YYYY HH:mm:ss')
        const formattedEndDate = Moment(endDate).format('MM-DD-YYYY HH:mm:ss')
        if (endDate < Moment(startDate).add(24, 'h')) {
            this.setState({
                isLoading: true,
                playback: true
            }, () => {
                this.props.searchLog(formattedStartDate, formattedEndDate)
            })

            if (!noDataTimeout) {
                console.log('scale', this.state.scale)
                noDataTimeout = setTimeout(() => {
                    if (this.state.scale === 0) {
                        this.setState({
                            isLoading: false
                        }, () => {
                            alert("No Data found for specified dates or there was an error connecting to Network.")
                        })
                    }
                    else {
                        if (this.state.isLoading) {
                            this.setState({
                                isLoading: false
                            })
                        }
                        clearTimeout(noDataTimeout)
                    }

                }, 15000);
            }
        }
        else {
            alert("Please keep the duration within 24 hour range.")
        }

    }

    clearPlaybackInterval() {
        clearInterval(intervalTimer)
        intervalTimer = null
        this.setState({
            playback: true
        })
    }

    // handleClick = () => {
    //     this.props.toggle()
    // };

    render() {
        const { startDate, endDate, timeStampSlider, currTimeStamp } = this.state
        let element: HTMLElement | null = document.getElementById("slider")

        return (<div className="modal_content">
            {/* <div elevation={1}> */}
            <span className="close" onClick={() => {
                this.setState({
                    currTimeStamp: new Date()
                })
                this.props.toggle()
            }}>&times; </span>
            <div className="row">
                <div className="form-group col-12 col-sm-10 col-md-2 col-lg-2 col-xl-2">
                    <DateTimeComponent
                        value={startDate}
                        label="Start Date"
                        handleChange={(startDate: Date) => {
                            this.setState({ startDate, scale: 0 })
                        }}
                        format="MM/DD/YYYY hh:mm a"
                    />
                </div>
                <div className="form-group col-12 col-sm-10 col-md-2 col-lg-2 col-xl-2">
                    <DateTimeComponent
                        value={endDate}
                        label="End Date"
                        handleChange={(endDate: Date) => {
                            this.setState({ endDate })
                        }}
                        minDate={startDate}
                        maxDate={Moment(startDate).add(24, 'h')}
                        format="MM/DD/YYYY hh:mm a"
                    />
                </div>
                <div className="row form-group col-12 col-sm-10 col-md-2 col-lg-2 col-xl-2"
                    style={{ marginTop: "2em" }}>
                    <Tooltip title="Search" placement="top" >
                        <SearchRounded style={{ marginRight: "0.4em" }} onClick={() => { this.onSearchClick(startDate, endDate) }} />
                    </Tooltip>

                    {this.state.playback ? <Tooltip title="Play" placement="top">
                        <PlayArrow style={{ marginRight: "0.4em" }} onClick={() => {
                            this.props.updateDataWithInterval()
                            intervalTimer = setInterval(() => {
                                if (this.props.currentPosition === 0) {
                                    this.clearPlaybackInterval()
                                }
                                else {
                                    this.setState({
                                        playback: false
                                    })
                                }

                            }, 5000)
                        }} /></Tooltip> :

                        <Tooltip title="Pause" placement="top">
                            <Pause style={{ marginRight: "0.4em" }} onClick={() => {
                                if (intervalTimer) {

                                    this.clearPlaybackInterval()
                                }
                                this.props.pauseFrame()
                            }} />
                        </Tooltip>}

                    {/*[DJ:6/19/2020] <SpeedRounded  /> */}
                    {/** If the user clicks just once then 1x, twice then 2x, thrice then 3x..... 
                     * Add the x part to the title with each click 
                     * Speed requirements: 1x, 2x, 3x, 5x, 10x*/}
                    <Tooltip title="Previous" placement="top">
                        <FastRewind style={{ marginRight: "0.6em" }} onClick={() => {
                            if (intervalTimer) {
                                // clearInterval(intervalTimer)
                                // intervalTimer = null
                                // this.setState({
                                //     playback: true
                                // })
                                this.clearPlaybackInterval()
                            }
                            this.props.previousOrNext(true)
                        }} />
                    </Tooltip>

                    <Tooltip title="Next" placement="top">
                        <FastForward onClick={() => {
                            if (intervalTimer) {
                                clearInterval(intervalTimer)
                                intervalTimer = null
                                this.setState({
                                    playback: true
                                })
                            }
                            this.props.previousOrNext(false)
                        }} />
                    </Tooltip>

                </div>

                <div className="row form-group col-12 col-sm-10 col-md-6 col-lg-6 col-xl-6">
                    <div className="row form-group col-12 col-sm-10 col-md-9 col-lg-9 col-xl-9">
                        <StyledSlider
                            style={{
                                marginTop: '1.5em',
                                //padding: '15px',
                                //width: '30vw'
                            }}
                            id="slider"
                            min={0}
                            max={this.state.scale}
                            disabled={!(this.state.scale > 0)}
                            name={"timeStampSlider"}
                            aria-label="linesSlider"
                            value={this.props.currentPosition}
                            onChange={(event: any, newValue: any) => {
                                if (this.state.playback) {
                                    this.props.slide(newValue)
                                }
                            }}
                            onMouseOver={() => {
                                if (this.state.playback) {
                                    if (element) {
                                        element.style.cursor = 'pointer'
                                    }
                                }
                                else {
                                    if (element) {
                                        element.style.cursor = 'not-allowed'
                                    }
                                }
                            }} />
                        < br /> {this.state.isLoading ? "Loading..." : ""}

                        {/* // onMouseUp={() => {
                        //     if (curSliderValue !== sliderValue) {
                        //         sliderValue = curSliderValue;
                        //     }
                        //     this.updateTimeStamp()
                        // }}
                       */}
                    </div>
                    <div
                        className="row form-group col-12 col-sm-10 col-md-3 col-lg-3 col-xl-3"
                        style={{ marginLeft: "4em", marginTop: "2em", fontWeight: 'bold' }}>
                        {Moment(currTimeStamp).format('MM-DD-YYYY hh:mm:ss a')}</div>
                </div>

            </div>

        </div >)
    }
}

/** [ECN: 10/29/2020] -  */
export const DateTimeToDay = () => {

    var [date,setDate] = useState(new Date());
    
    useEffect(() => {
        var timer = setInterval(()=>setDate(new Date()), 1000 )
        return function cleanup() {
            clearInterval(timer)
        }
    
    });

    return(
        <div>
          { /* <p> Time : {date.toLocaleTimeString()}</p>
            <p> Date : {date.toLocaleDateString()}</p>*/}
            <p>{dateFormat(date, "dddd, dS mmmm yyyy h:MM:ss TT")}</p>
        </div>
    )
}

export  const AutocompleteComponent = (props: any) => {
    //const { options: optionsProp } = props;
    return (
      <Autocomplete
        value={props.selectedElement}
        id={props.id}
        options={props.options}
        getOptionLabel={opt => opt.label}
        size='small'
        //style={{ width: 300 , height:50 }}
        renderInput={(params) => <TextField {...params} label={props.label} variant="outlined" />}
        onChange = {props.handleChange}
      />
    );
  }
  
  
export const CheckNestingPunchOrOpera = async (comp_employee_no:string ,dateBegin : string , dateEnd: string) => {
    let listPunch: Array<any> = [];
    let byPass = "01";
    let errorMessage : string = "";
    let server = !isNullOrUndefined(localStorage.getItem('servername')) ? localStorage.getItem('servername') : ""
    axios.get(`${server}/api/getpunchjoined/${comp_employee_no}/${dateBegin}/${dateEnd}`)
         .then(res => {
                listPunch =res.data
                byPass="01"
                errorMessage=""
        })
        .catch(err => {
                //errorLogMessages(err);
                listPunch = [], 
                byPass="",
                errorMessage= err
        });
        return {listPunch, byPass, errorMessage}       
}
export const CheckOpenPunch = async (comp_employee_no:string ,keyPunch : string , punchType: string,taskNo?: string,operationNo?: string) => {// punchType equals punch or operation
    let punchInfo : Array<any> = [];
    let errorMessage : string = "";
    const server = !isNullOrUndefined(localStorage.getItem('servername')) ? localStorage.getItem('servername') : ""
    await axios.get(`${server}/api/getopenedpunch/${comp_employee_no}/${keyPunch}/${punchType}/${taskNo}/${operationNo}`)
         .then(res => {
                punchInfo =res.data[0]
                errorMessage=""
        })
        .catch(err => {
                //errorLogMessages(err);
                punchInfo = [], 
                errorMessage= err
        });
        return {punchInfo, errorMessage} 
}
export const XgridComponent = (props: any) => {
    /*console.log(props.rows)
  */
  const columns: ColDef[] = [
        { field: 'id', headerName: 'Emp#', width: 90 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'shift',headerName: 'Shift', width: 90,},
  ]
    
      return (
        <div  style={{ height: 400, width: '100%',zIndex:1 }}>
          <DataGrid 
              rows={props.rows} columns={columns}  
              //checkboxSelection
              onRowClick = {props.handleSelectEmployee}
              disableMultipleSelection={true}
              showColumnRightBorder={true}
              //onSelectionChange ={props.onSelectionChange}
              //rowHeight={30}
              //hideFooterRowCount={true}
              //hideFooterSelectedRowCount={true}
              //hideFooterPagination={true}
          />
        </div>
      )
}
export const ThreeDotMenu = (props: any) =>{

    const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickMoreVertIcon = (event) => {
    event.stopPropagation()
    event.preventDefault()
    //console.log('open',Boolean(anchorEl),event.currentTarget)
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    event.stopPropagation()
    event.preventDefault()
      switch (event.currentTarget.id){
        case 'views':
            alert('fenettre en cours de developpement')
           // props.gotoCalandarEmploye()
            break
        case 'details':
            alert('fenettre en cours de developpement')
            //props.punchInOut()
            break
      }
  }
  return (
    <Card elevation={0} style={{color: '#212529',backgroundColor: 'transparent',borderColor: '#f8f9fa'}}>
        <Menu
            id={'menu' + props.comEmployeeNo}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            key={'menu' + props.compEmployeeNo}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
        >  
            <MenuItem key={'mi2'} onClick={handleClose} id='views'><FontAwesomeIcon icon={faEye} />&nbsp;Views</MenuItem>
            <MenuItem key={'mi3' } onClick={handleClose} id='details'><InfoIcon/>&nbsp;Details</MenuItem>
        </Menu> 
        <IconButton key={'ic' + props.compEmployeeNo} aria-label="settings" style={{padding:'7px 5px'}} onClick={handleClickMoreVertIcon}>
                    <MoreVertIcon titleAccess={'More options'}  />
                </IconButton>
        </Card>
  )
}
export  const CardComponent = (props: any) => {
    const styles = theme => ({
        item2: {
          order: 3,
          [theme.breakpoints.up('sm')]: {
            order: 2,
          },
        },
        item3: {
          order: 2,
          [theme.breakpoints.up('sm')]: {
            order: 3,
          },
        },
      });
    const useStyles = makeStyles((theme) => ({
        root: {
          width: props.width ? '400px' : 'auto',
          margin : props.width ? 15 : 0
        },
        media: {
          height: 0,
          paddingTop: '56.25%', // 16:9
        },
        expand: {
          transform: 'rotate(0deg)',
          marginLeft: 'auto',
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
        },
        expandOpen: {
          transform: 'rotate(180deg)',
        },
        present: {
          backgroundColor: green[500],
        },
        absent: {
          backgroundColor: red[500] ,
        },
        delPadding : {
            padding: '5px 10px'
        },
        rootGrid: {
            flexGrow: 1,
          },
        paperGrig: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        }/*,
        item2: {
            order: 3,
            [theme.breakpoints.up('sm')]: {
              order: 2,
            },
          },
        item3: {
            order: 2,
            [theme.breakpoints.up('sm')]: {
              order: 3,
            },
        },
        item1:{
            [theme.breakpoints.up('sm')]: {
                textAlign: 'right'
              }
        }*/
      }));
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickMoreVertIcon = (event) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    switch (event.currentTarget.id){
        case 'calendar':
            props.gotoCalandarEmploye()
            break
        case 'inout':
            props.punchInOut()
            break
        case 'Jobs':
            props.gotoPunchJob()
            break
        case 'Time':
            props.gotoPunchClock()
            break
      }
    setAnchorEl(null);
  }

    let imageBackground = props.imageBackground
    return (
        <Card elevation={3} className={classes.root} key={'card' + props.compEmployeeNo} >
      
            <Menu
                    id={'menu' + props.comEmployeeNo}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    key={'menu' + props.compEmployeeNo}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
            <MenuItem key={'mi1' + props.compEmployeeNo} onClick={handleClose} id='inout'  ><AccessAlarmIcon/>&nbsp;{props.hasPresent ? 'Clock Out' : 'Clock In'}</MenuItem>
            <MenuItem key={'mi2' + props.compEmployeeNo} onClick={handleClose} id='calendar'><EventIcon/>&nbsp;Calendar</MenuItem>
            <MenuItem key={'mi3' + props.compEmployeeNo} onClick={handleClose} id={props.from}><FitnessCenterIcon/>&nbsp;{props.from}</MenuItem>
        </Menu> 
        <div className={classes.rootGrid}>
            <Grid container spacing={1} >
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}  style={{textAlign:'center'}} >
               {/*  {imageBackground ?
                            <img style={{ width: "8em", height: "9em" }} className="card-img-top" src={imageBackground} /> :
                            <AccountBoxIcon style={{ width: "5em", height: "5em" }} />
                } */}
                 <AccountBoxIcon style={{ width: "5em", height: "5em" }} />{/**/}
                <br/><label htmlFor="lblName" style={{ fontSize: '0.9rem' }}>#ID : </label>
                    <label htmlFor="lblNameVal" className="font-weight-bold" style={{ fontSize: '0.9rem' }}> &nbsp; {props.compEmployeeNo} </label>
  
                </Grid> 
                <Grid item xs={7} sm={7}  md={7} lg={7} xl={7}  style={{textAlign:'center'}}>
                    <div className="card-tittle text-left" style={{ fontSize: "1.5rem",lineHeight:1,marginLeft:'10px',width:'105%' }}>
                        <label htmlFor="lblName" style={{ fontSize: '0.9rem' }}>Name : </label><label htmlFor="lblNameVal" className="font-weight-bold" style={{ fontSize: '0.9rem' }}> &nbsp; {props.fullName} </label>
                        <br/><label htmlFor="lblShift" style={{ fontSize: '0.9rem' }}>Role : </label><label htmlFor="lblNameVal" className="font-weight-bold" style={{ fontSize: '0.9rem' }}>&nbsp; { props.role} </label>
                        <br/><input className={`form-control text-center ${props.hasActif ? 'active' : props.hasPresent ? 'present' : 'missing'} font-weight-bold`} disabled value={props.hasActif ? 'Active' : props.hasPresent ? 'Present' : 'Absent'} />
                        <label htmlFor="lblShift" style={{ fontSize: '0.9rem' }}>Shift : </label><label htmlFor="lblNameVal" className="font-weight-bold" style={{ fontSize: '0.9rem' }}>&nbsp; { props.shift} </label>
                        <br/><label htmlFor="lblpresenceTime" style={{ fontSize: '0.9rem' }}>Presence Time : </label><label htmlFor="lblNameVal" className="font-weight-bold" style={{ fontSize: '0.9rem' }}>  </label>
                        <br/><label htmlFor="lblWorkTime" style={{ fontSize: '0.9rem' }}>Work Time : </label><label htmlFor="lblNameVal" className="font-weight-bold" style={{ fontSize: '0.9rem' }}>  </label>
                         </div>
                </Grid>
                <Grid item xs={1} sm={1}  md={1} lg={1} xl={1}  style={{textAlign:'right'}}>
                <IconButton key={'ic' + props.compEmployeeNo} aria-label="settings" style={{padding:'10px 5px 10px 0px'}} onClick={handleClickMoreVertIcon}>
                    <MoreVertIcon titleAccess={'More options'}  />
                </IconButton>
                </Grid>
            </Grid>
     </div> 
    </Card>
  );
    
}
/*  END */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      color: 'var(--secondary-color)',
      '&:hover': {
        color: 'var(--secondary-color)',
      },
    },
    fabProgress: {
      color:'var(--secondary-color)',
      //position: 'absolute',
      //top: -6,
      //left: -6,
      zIndex: 1,
    },
    buttonProgress: {
      color: 'var(--secondary-color)',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    table: {
        minWidth: 650,
      },
      rootLinear: {
          width: '100%',
        }
  }),
);


 
  /*   Account Transfert Table*/
  export  const ReactTableComponent = (props: any) => {
    return (
        <div className="GroupTable">
        <ReactTable
        className="transferttable"
            style={{ margin: 0}}
            data={props.dataTable}
            columns={props.transferColumn} 
            defaultPageSize={10}
            showPageSizeOptions={true}
            rowsText= {translateString("rows")}
            pageText= {translateString("Page")}
            nextText= {translateString("Next")}
            previousText= {translateString("Previous")}
            loadingText= {translateString('Loading...')}
            noDataText= {translateString('No rows found')}
            ofText= {translateString('of')}
            /> 

         </div>
    )
  }
  
/*
    [XQ: 9/14/2020] - new isNullOrUndefined function to replace the deprecated util.isNullOrUndefined();
    [XQ: 12/7/2020] - updated the syntax, using double equal just because checking for null and undefined
                      for objects and primitives, but does not catch other fasly values or empty string
*/
export const isNullOrUndefined = (...args: any[]): boolean => args.some((param: any) => param == null);

//[AL: 12-11-2020 ] - vetical progress bar  - progress is the value of progress, width is the bar width , height is the bar height
export const VerticalProgress = ({ progress, width, height }) => {
    return (
        <Spring from={{ percent: 0 }} to={{ percent: progress }}>
            {({ percent }) => (
                <>
                    <div className="Verticalprogress vertical" style={{ width: width, height: height }}>
                        <div style={{ height: `${progress}%`, width: width }} className="Verticalprogress-bar">
                            <span className="whiteText">{`${percent.toFixed(1)}%`}</span>
                        </div>
                    </div> 
                </>
            )}
        </Spring>
    );
};



export const CircularIntegrationComponent = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [showStatus, setShowStatus] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: showStatus,
  });

  React.useEffect(() => {
    if(props.loading && !loading){
        setLoading(true);
    }
    if(!props.loading && loading){
        setLoading(false);
        setShowStatus(true);
        setSuccess(props.success ? true : false);
        timer.current = window.setTimeout(() => {
            setShowStatus(false);
            clearTimeout(timer.current);
        }, 2000);
    }
  });

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Box
          aria-label="TryEmail"
          className={buttonClassname}
        >
            {!showStatus ? <EmailIcon fontSize="large"/> : success ? <CheckIcon fontSize="large"/> : <ClearIcon fontSize="large"/>}
            {loading && <LinearProgress className={classes.fabProgress}/>}
        </Box>
      </div>
    </div>
  );
}

/*const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    root: {
        width: '100%',
      }
  });*/
function LinearProgressWithLabel(props) {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
  }),
)(LinearProgress);
  
  LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };
  
 /* const useStyles = makeStyles({
    root: {
      width: '100%',
    },
  });*/
  
  export const LinearWithValueLabel = (props: any) =>  {
    const classes = useStyles();
    const [progress, setProgress] = React.useState(10);
  
    /*React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
      }, 800);
      return () => {
        clearInterval(timer);
      };
    }, []);*/
  
    return (
      <div //style={{backgroundColor: '#f5f5f5'}}
       className={classes.rootLinear}>
        <LinearProgressWithLabel  value={props.progress} />
      </div>
    );
  }

  export const ProgressBar = (props) => {
  const {bgcolor,completed} = props;

  const fillerStyles = {
    width: `${completed}%`,
    backgroundColor: bgcolor,
    transition: 'width 1s ease-in-out',

  }

  return (
    <div className='progress schedule-progress'>
      <div className='progress-bar-schedule progress-bar-striped' style={fillerStyles} >
        <span className='progress-label' style={{padding:'4',color:'white',fontWeight:'bold',textAlign: 'center'}}>{`${completed}%`}</span>
      </div>
    </div>
  )
}



export const  CardBar = (props:any) => {
    const {bgcolor,proccess} = props;
  
    const fillerStyles = {
      width: `${proccess}%`,
      backgroundColor: bgcolor,
      transition: 'width 1s ease-in-out',
      boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset',
             }

         return (
        <div className='progress card-progress' style={{height: '11px'}}>
        <div className='progress-bar-card progress-bar-striped' style={fillerStyles}  >
          <span className='progress-label' style={{color:'white',fontWeight:'bold'}}>{`${proccess}%`}</span>
        </div>
        </div>
      
    )
  }
  


