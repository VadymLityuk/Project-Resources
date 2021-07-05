import React, { ChangeEvent } from "react";
import Modal from 'react-modal';
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-annotation';
import axios from 'axios';
import {
    Typography, Grid, List, ListItem, Button, TextField, ListSubheader, Box,
    ListItemText, ListItemIcon, Tooltip, CardHeader, IconButton, Divider
} from '@material-ui/core';
import Menu from '@material-ui/icons/Menu';
import AddCircle from '@material-ui/icons/AddCircle';
import Close from '@material-ui/icons/Close';
import { SelectComponent, translateString, isNullOrUndefined } from 'components/HelperMethods/ReusableComponents';
import { logMessages } from 'components/ProductionForAction/LogMessages';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '50%',
        height: '60%',
        fontSize: '1em',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid black',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        zIndex: '10',
        lineHeight: '1.5em'
    }
};

export default class CalculatorsModal extends React.Component<any, any>{
    constructor(props: any) {
        super(props);

        let server = (!isNullOrUndefined(localStorage.getItem('servername')) && localStorage.getItem('servername') != 'null' && localStorage.getItem('servername') != 'undefined') ? localStorage.getItem('servername') : ""
        
        this.state = {
            server: server,
            answer: '',
            calculatorTitle: '',
            operationKey: '',
            showOptions: false,
            showDropdown: false,
            calculators: new Array(),
            descriptions: new Array(),
            parameters: new Array(),
        }
    }

    componentDidMount() {
        let calculators = new Array();
        let parameters = new Array();
        let descriptions = new Array();

        //Modal that has already a calculator key and will open directly to its options
        if (this.props.calculatorKey !== null && this.props.calculatorKey !== undefined) {
            let dataArr = [`${this.state.server}/api/getCalculators/${this.props.calculatorKey}/${0}`,
            `${this.state.server}/api/getCalculatorsParameters/${this.props.calculatorKey}`];

            axios.all(dataArr.map(l => axios.get(l)))
                .then(
                    axios.spread((...res) => {
                        calculators = res[0].data;
                        descriptions = res[1].data[0];
                        parameters = res[1].data[1];

                        for(let i = 0; i < calculators.length; i++) {
                            calculators[i].IsSelected = false;
                
                            if(calculators[i].CalculatorKey === this.props.calculatorKey) {
                                calculators[i].IsSelected = true;
                            }
                        }

                        parameters.forEach((d, i) => {
                            d.Count = 0;
                            d.Entity = '';
                            d.Entities = new Array();
                        })

                        this.setState({ calculators, 
                                        parameters, 
                                        descriptions, 
                                        calculatorTitle: calculators[0].CalculatorDescription, 
                                        calculatorKey: this.props.calculatorKey, 
                                        showOptions: true }, 
                                        () => this.getEntities());
                    }));
        }
        //Modal in the Top Nav where you have to choose the calculator key
        else {
            axios.get(`${this.state.server}/api/getCalculators/${null}/${0}`)
                .then((res) => {
                    calculators = res.data;

                    calculators.forEach((d, i) => {
                        d.IsSelected = false;
                    })

                    this.setState({ calculators });
                })
        }
    }

    //Event called when choosing a calculator key
    chooseCalculation = (calculatorKey: string) => {
        let calculators = this.state.calculators;
        let parameters = new Array();
        let descriptions = new Array();
        let index = 0;

        for(let i = 0; i < calculators.length; i++) {
            calculators[i].IsSelected = false;

            if(calculators[i].CalculatorKey === calculatorKey) {
                calculators[i].IsSelected = true;
                index = i;
            }
        }

        axios.get(`${this.state.server}/api/getCalculatorsParameters/${calculatorKey}`)
            .then((res) => {
                descriptions = res.data[0];
                parameters = res.data[1];
            
                parameters.forEach((d, i) => {
                    if(d.IsEntitySelection === 1) {
                        d.Entity = '';
                        d.Entities = new Array();
                    }
                    else {
                        d.Count = 0;
                    }
                })

                this.setState({ calculators, 
                                parameters,
                                descriptions, 
                                calculatorTitle: 
                                calculators[index].CalculatorDescription, 
                                calculatorKey, 
                                showOptions: true, 
                                showDropdown: false,
                                answer: 0 }, 
                                () => this.getEntities());
            })
    }

    getEntities = () => {
        let { parameters } = this.state;

        parameters.forEach((d, i) => {
            let entities = new Array();
            let uniqueEntities = new Array();
            //Only if the calculator has a dropdown (select component)
            if (d.IsEntitySelection === 1) {
                axios.get(`${this.state.server}/api/customFormsGetEntities/${d.ModelPropertyKey}`)
                    .then((res) => {
                        res.data.forEach((e, j) => {
                            //Taking out the duplicates dropdown options
                            if(!uniqueEntities.includes(e.EntityDescription)) {
                                uniqueEntities.push(e.EntityDescription);
                                entities.push({
                                    EntityDescription: e.EntityDescription,
                                    RecordKey: e.RecordKey,
                                });
                            }
                        })
                        d.Entity = entities[0].RecordKey;
                        d.Entities = entities;
                        this.setState({ parameters, showDropdown: true });
                    })
            }
        })
    }

    calculate = () => {
        let { parameters, calculatorKey } = this.state;
        let keys = "";
        let values = "";

        //Modifying the keys and values string so that it fits the API call
        parameters.forEach((d, i) => {
            if (i === 0) {
                keys = keys.concat("", d.CalculatorOperationKey);
            }
            else {
                keys = keys.concat("|", d.CalculatorOperationKey);
            }

            if(d.IsEntitySelection === 1) {
                d.Entities.forEach((e, j) => {
                    if(e.RecordKey === d.Entity) {
                        if (i === 0) {
                            values = values.concat("", e.RecordKey);
                        }
                        else {
                            values = values.concat("|", e.RecordKey);
                        }
                    }
                })
            }
            else {
                if (i === 0) {
                    values = values.concat("", d.Count);
                }
                else {
                    values = values.concat("|", d.Count);
                }
            }
        })

        axios.get(`${this.state.server}/api/calculateCalculators/${calculatorKey}/${keys}/${values}`)
            .then((res) => {
                this.setState({ answer: res.data[0].CalculationResult });
            }).catch((err: Error) => {
                console.log(err.message);
            })
    }

    handleChange = (e: ChangeEvent<HTMLSelectElement>, index: number) => {
        const { value } = e.currentTarget;
        let { parameters } = this.state;

        parameters[index].Entity = value;

        this.setState({ parameters });
    }

    handleCountChange = (e: ChangeEvent<any>, index: number) => {
        let { parameters } = this.state;

        parameters[index].Count = e.target.value;

        this.setState({ parameters });
    }

    closeModal() {
        this.props.closeCalculatorsModal();
    }

    render() {
        const { calculators, showDropdown, answer, calculatorTitle, parameters, descriptions, showOptions } = this.state;

        return (
            <Modal
                isOpen={this.props.showCalculatorsModal}
                onRequestClose={() => this.closeModal()}
                style={customStyles}>
                <CardHeader
                    style={{ marginLeft: 0, backgroundColor: "var(--primary-color)", color: "white", textAlign: "center" }}
                    titleTypographyProps={{ variant: 'h4' }}
                    title="Calculators"
                    action={
                        <IconButton aria-label="close" onClick={() => this.closeModal()}>
                            <Close style={{ color: 'white' }} />
                        </IconButton>
                    }/>
                {calculators.length > 0 && 
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Box m={1} style={{ border: '1px rgba(0, 0, 0, 0.5) solid' }}>
                        <Grid container>
                            <List dense>
                                <ListSubheader style={{color: 'black', fontWeight: 'bold'}}>Pick Calculation to Run:</ListSubheader>
                                <Divider/>
                                {/* [XQ: 7/2/2020] - fixed minor bug, added unique key for each child in the list */}
                                {calculators.map((value: any) => {
                                    return (
                                        <Grid item key={Math.random()}>
                                            <ListItem key={Math.random()} selected={value.IsSelected} button onClick={() => this.chooseCalculation(value.CalculatorKey)}>
                                                <ListItemIcon key={Math.random()}><Menu key={Math.random()} /></ListItemIcon>
                                                <ListItemText key={Math.random()} primary={value.CalculatorDescription} />
                                            </ListItem>
                                            <Divider/>
                                        </Grid>
                                    )
                                })}
                            </List>
                        </Grid>
                    </Box>
                    {showOptions &&
                    <div style={{ width: '50%', textAlign: "center" }}>
                        <Box m={1} style={{ border: '1px rgba(0, 0, 0, 0.5) solid' }}>
                            <Grid container direction="column" spacing={2}>
                                <Grid item>
                                    <Typography variant="h6">{calculatorTitle}</Typography>
                                </Grid>
                                {/* [XQ: 7/2/2020] - fixed minor bug: each child in the list should have a unique key prop */}
                                {parameters.map((value: any, index: number) => {
                                if (value.IsEntitySelection === 1) {
                                    return (
                                        <Grid item key={value.CalculatorOperationKey}>
                                        <Box m={1}>
                                            {showDropdown && 
                                                <SelectComponent
                                                    name="entity"
                                                    options={value.Entities}
                                                    value={value.Entity}
                                                    label={value.InputDescription}
                                                    enableAll={false}
                                                    handleChange={(e) => this.handleChange(e, index)}
                                                />}
                                        </Box>
                                    </Grid>
                                    )
                                }
                                else {
                                    return (
                                        <Grid item key={value.CalculatorOperationKey}>
                                            <Box m={1}>
                                                <TextField
                                                    variant="outlined" 
                                                    label={value.InputDescription} 
                                                    type="number" 
                                                    value={value.Count} 
                                                    onChange={(e) => this.handleCountChange(e, index)}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                        style: {
                                                            color: 'black',
                                                        }
                                                    }}/>
                                            </Box>
                                        </Grid>
                                    )
                                }
                                })}
                                <Grid item>
                                    <Box m={1}>
                                        <Button 
                                            variant="contained" 
                                            style={{backgroundColor: 'var(--secondary-color)', color: 'white'}} 
                                            onClick={() => this.calculate()} 
                                            endIcon={<AddCircle />}
                                            >Calculate
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <div style={{ marginTop: '20px' }}>
                            {descriptions.map((value: any) => {
                                return (
                                    <Tooltip key={Math.random()} title="Copy to Clipboard">
                                        <CopyToClipboard 
                                            key={Math.random()} 
                                            text={answer} 
                                            onCopy={() => 
                                            logMessages(translateString("Success!"), "200", translateString("Result copied to clipboard: ") + answer, 3000, "success")}>
                                            <Button key={Math.random()} variant="contained">
                                                <Typography key={Math.random()}>{value.ResultDescription}</Typography>
                                                <Box m={2}/>
                                                <TextField key={Math.random()} InputProps={{ readOnly: true }} defaultValue={answer} />
                                            </Button>
                                        </CopyToClipboard>
                                    </Tooltip>
                                )
                            })}
                        </div>
                    </div>}
                </div>}
            </Modal >
        )
    }
}
//calculationModal
