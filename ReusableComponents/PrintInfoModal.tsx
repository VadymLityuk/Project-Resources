
import React from "react";
import Modal from 'react-modal';
import axios from 'axios';
import { translateString, StringTranslator,SelectComponent } from 'components/HelperMethods/ReusableComponents';
import { CardHeader, IconButton, Grid, TextField, Button } from "@material-ui/core";


const modalCustomStyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
       // maxWidth: '700px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        outline: 'none',
        zIndex: '10',
    }
};


// export const PrintOptionModal = (props: any) => {


//     const [inputPrintsToAdd, setInputPrintsToAdd] = React.useState(1);
//     const [committedPrintsToAdd, setCommittedPrintsToAdd] = React.useState(0);

//     return (

//         <div>
//         <Modal 
//         isOpen={this.props.modalOpened}
//         style={modalCustomStyle}>
//         <CardHeader
//             style={{ marginLeft: 0,
//             backgroundColor: 'rgba(0, 0, 0, .03)',
//             border: '1px solid rgba(0, 0, 0, .125)', color: "black",borderRadius: '5px', textAlign: "center",fontWeight: 'bold'}}
//             titleTypographyProps={{ variant: 'h4' }}
//                         title={translateString(" Number of prints to add")}/>
//             <Grid className=" offset-3 col-6" >
//             <label style={{ fontWeight: 'bold', color: '#797581'}}>Select your printer</label>
//                     <SelectComponent
//                     name="selectedRemovalValue"
//                     options={this.props.remType} 
//                     value={this.props.remValue}
//                     handleChange={this.props.onChangeRemValue} />
//             </Grid>
//         <Grid className=" offset-3 col-6" >
//         <div>
//           <label>Number of prints to add</label>
//           <input
//             type="number"
//             value={inputPrintsToAdd}
//             onChange={(e) =>
//                 setInputPrintsToAdd(parseInt(e.currentTarget.value, 10))
//             }
//           />
//         </div>
//         <button
//           onClick={() => {
//             setCommittedPrintsToAdd(inputPrintsToAdd);
//           }}
//         >
//         </button>
//         {/* {fields} */}
//         {[...Array(committedPrintsToAdd)].map(
//           (value: undefined, index: number) => (
//             <Field id={index + 1} key={index} />
//           )
//         )}
//             </Grid>
//         <Grid container justify="flex-end" spacing={2} style={{marginTop: '10px'}}>
//         <Grid item >
//              <Button 
//             variant="outlined"
//             color="secondary"
//             onClick={() => this.handleClosePackageModal()}>
//            <StringTranslator>Close</StringTranslator>
//              </Button>
//             </Grid >
//         <Grid item >
//              <Button 
//             variant="outlined"
//             color="primary"
//             onClick={() => this.handleClosePackageModal()}>
//             <StringTranslator>Submit</StringTranslator>
//              </Button>
//         </Grid>
//         </Grid>
//      </Modal >
//       </div>
//     );
//   }

// const Field = ({ id }: { id: number }) => (
// <div>
//   <label htmlFor={`field${id}`}>Field {id}</label>
//   <input id={`field${id}`} type="text" />
// </div>
// );



export class PrintInfoModal extends React.Component<any, any> {
    
    constructor(props) {
        super(props);
        this.state = {
            name: new Array(),
            label: new Array(),
            initialPrint : 0,
        }
    }


    componentDidUpdate(prevProps: any) {
        if (JSON.stringify(this.props.uniqueId) !== JSON.stringify(prevProps.uniqueId)) {
            this.getPrintData();
        }
    }
    getPrintData = () => {
        let { initialPrint} = this.state;
        
        initialPrint = this.props.quantityPrint;

        this.setState({ initialPrint});
    }
   
    handleCancelPrintingModal = () => {
        this.props.onCancelPrintModal(this.state.initialPrint);
    }

    handleClosePackageModal = () => {
        this.props.onClosePrintModal();
    }

    handleSubmitPackageModal = () => {
        this.props.onClosePrintModal();
    }

    handlePrint = () => {
        this.props.OnPrintButton();
    }


    render() {
        
        let optionsarray = [
            {DESCRIP: "Printer 1", ID: "Canon Printer"},
            {DESCRIP: "Printer 2", ID: "HP Print TS"}
        ]
        
        const {  } = this.state;
        return (                
            <Modal 
                isOpen={this.props.modalOpened}
                style={modalCustomStyle}>
                <CardHeader
                    style={{ marginLeft: 0,
                    backgroundColor: 'rgba(0, 0, 0, .03)',
                    border: '1px solid rgba(0, 0, 0, .125)', color: "black",borderRadius: '5px', textAlign: "center",fontWeight: 'bold'}}
                    titleTypographyProps={{ variant: 'h5' }}
                    title={translateString("Printing")}/>
                <Grid className=" col-12" 
                    style={{width: '370px',paddingTop: '12px'}}>
                        <label style={{ fontWeight: 'bold', color: '#797581'}}>{translateString("Select your printer")}</label>
                    <SelectComponent
                    name="SelectPrint"
                    options={optionsarray} 
                    value={this.props.remValue}
                    handleChange={this.props.onChangeRemValue} />
                </Grid>
                    <Grid className="col-12" 
                    style={{width: '370px',paddingTop: '22px'}}>
                        <label style={{ fontWeight: 'bold', color: '#797581'}}>{translateString("Select printing quantity")}</label>
                        <TextField
                            name="qty"
                            type="number"
                            variant="outlined"
                            value={this.props.quantityPrint}
                            label={translateString("Printing Quantity")}
                            onChange={(e) => this.props.handlePrintQuantity(e)}
                             />
                    </Grid>
                    <hr/>
                <Grid container justify="flex-end" spacing={2} style={{marginTop: '8px'}}>
                <Grid item >
                     <Button 
                    variant="outlined"
                    color="secondary"
                    onClick={() => this.handleCancelPrintingModal()}>
                   <StringTranslator>Cancel</StringTranslator>
                     </Button>
                    </Grid >
                <Grid item >
                     <Button 
                    variant="outlined"
                    color="primary"
                    onClick={() => this.handlePrint()}>
                    <StringTranslator>Print</StringTranslator>
                     </Button>
                </Grid>
                </Grid>
             </Modal >
        )
    }
}






