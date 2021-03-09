///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
//                                                BENJAMIN CARRIRER
//                                                  SKL Aluminium
// 
//                                      start: 11 nov 2020  last modif: 9 feb 2021
// 
//                                               Jira task# D4A-303
//                                            SKL Product Configurator
// 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React, { ChangeEvent } from 'react'
import axios from "axios";
import { LinkTitle } from 'components/LinkTitle';
import { Tooltip, Button, Box, Grid, Card, CardMedia, CardContent, TextField, createMuiTheme, FormControl, Typography, Divider,
    TextFieldProps, BoxProps, Accordion, AccordionSummary, AccordionDetails, MenuItem, Switch, FormControlLabel, RadioGroup, Radio, FormLabel } from '@material-ui/core';
import { translateString, StringTranslator, bufferToBase64, convertBufferArrayToDataURL,CircularIntegrationComponent } from 'components/HelperMethods/ReusableComponents';
import { InstructionsModal } from 'components/ProductionForAction/Modals/Modals';
import { errorLogMessages, errorMessages, logMessages } from 'components/ProductionForAction/LogMessages';
import { isNullOrUndefined } from 'components/HelperMethods/ReusableComponents';
import {createStyles, makeStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { AttachMoney, ExpandMore, Label, MonetizationOn, PictureAsPdf, Save } from '@material-ui/icons';
import { height, TypographyProps } from '@material-ui/system';
import { promises } from 'fs';
import { resolve } from 'dns';
import Axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import FiberNewIcon from '@material-ui/icons/FiberNew';

import defaultPreviewIcon from '../Images/D4A_Horizontal.png';

////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                             // Material UI Styling override //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** put site's theme (secondary color highlight) as highlight */
const ColorTextField = withStyles({
  root: {
      '& label.Mui-focused': {
          color: 'var(--secondary-color)',
      },
      '& .MuiInput-underline:after': {
          borderBottomColor: 'var(--secondary-color)',
          borderBottomWidth: '2px'
      },
      '& .MuiInput-underline:before': {
          borderBottomWidth: '2px',
      },
  },
})(TextField);




/** text box that take all space available (build on top of colorTextField), maxHeight: '20vh' */
const FullSizeTextField = withStyles({
  root: {
      '& .MuiInputBase-root': {
          padding: '8px',
          height: '100%',
          '& input': {
              height: '100%'
          }
      },
      '& .MuiInputBase-inputMultiline': {
          height: 'auto',
          maxHeight: '20vh',
          marginBottom: 'auto',
          overflow: 'auto !important'
      },
      '& .MuiInput-underline:before': {
          borderBottomWidth: '0px',
      },
  },
})(ColorTextField);

/** put site's theme (secondary color highlight) as highlight */
const ColorButton = withStyles({
  text: {
      '&:hover': {
          color: 'var(--secondary-color)',
          '& p': {
              color: "rgba(0, 0, 0, 0.87)"
          }
      },
  }
})(Button);

/** put site's theme (secondary color highlight) as highlight */
const ColorSwitch = withStyles({
  switchBase: {
      '&$checked': {
        color: 'var(--secondary-color)',
      },
      '&$checked + $track': {
        backgroundColor: 'var(--secondary-color)',
      },
    },
    checked: {},
    track: {},
})(Switch);

/** put site's theme (secondary color highlight) as highlight */
const ColorRadio = withStyles({
    checked: {
      color: 'var(--secondary-color) !important',
    }
})(Radio);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                // TypeScript Interface //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** data type for generating a Question (passed as props in Render)*/
interface ConfiguratorQuestionProps {
    server?: string;
    userId?: string;
    title: string;
    image: any;
    key: string;
    index: number;
    type: IQuestionType;
    categoryName: string;
    optionID_or_Seq: number;
    hidden?: boolean;
    defaultValue?: any;
    options?: Array<options>;
    MaterialGradeColorOptions?: MaterialGradeColorOptions;
    focusFunc?: any;
}

/** data tpe for question type "Material" */
interface MaterialGradeColorOptions {
    material: Array<options>;
    grade: Array<options>;
    color: Array<options>;
    materialValue: number;
    gradeValue: number;
    colorValue: number;
}

/** option data type used to populate <select>'s options */
interface options {
      value: any;
      title: string;
}

/** types of input fields */
enum IQuestionType {
      text,
      number,
      select,
      switch,
      radio,
}

/** used to classify/divide ConfiguratorQuestionProps by category name */
interface QuestionDivider {
    title: string;
    questions: Array<ConfiguratorQuestionProps>;
}

/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////_  PRODUCT CONFIGURATOR  _//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
class ProductConfigurator extends React.Component <any,any> {
    constructor(props){
        super(props);
        const tServer = !isNullOrUndefined(localStorage.getItem('servername')) ? localStorage.getItem('servername') : "";
        const tUserId = !isNullOrUndefined(localStorage.getItem('userID')) ? localStorage.userID : ""
        const logoURL : string = localStorage.getItem('customerLogo')!
        const customerLogo = convertBufferArrayToDataURL(JSON.parse(logoURL))
        const tSoum = !isNullOrUndefined(localStorage.getItem('soumNo')) ? localStorage.soumNum : 0
        this.state = {
            previewIndex: -1,
            previewImage: 0,
            defaultPreviewImage: customerLogo,
            imageFiles: new Object(),
            previewProductDescription: "",
            previewProductID: "",
            note: "",
            questionsSubdivide: new Array<QuestionDivider>(),
            questionGroupNames: new Array<string>(),  
            configuratorQuestions: new Array<ConfiguratorQuestionProps>(),
            configuratorDimentions: new Array<Object>(),
            configuratorOptions: new Array<Object>(),
            configuratorMaterial: new Array<Object>(),
            selectOptions: new Array<Object>(),
            materialOptions: new Array<Object>(),
            userID: tUserId,
            server : tServer,
            openInstructionsModal: false,
            isAdding: false,
            isLoading: false,  
            isEmailLoading: false,
            emailLoadingStatus: true,
            isLoadingImages: false,
            permissionCodes: [],
            TesterID: " ",
            pathArray: window.location.pathname.split('/'),
            UserTemplate: new Array<Object>(),
            nomencalteTemplateUser: [],
            nomenclatTemplateId: 0,
            soumNum: tSoum,
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                // CLASS METHODS //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    componentDidMount(){
        this.clearRefresh()
        this.getTemplate()
    }

    openInstructions = () => {
        this.setState({
            openInstructionsModal: true,
        })
    }
    closeInstructions = () => {
        this.setState({
            openInstructionsModal: false,  
        })
    }

    /** used to compare recived questions data to existing question data (but can be used for any array compare) 
        - return true if [param] is same in every elem of both array */
    compareOptionsArrays = (a: Array<any>, b: Array<any>, parameter: string) => {
        if(a.length !== b.length){
            return false
        }
        let i = 0
        return a.every( (elem) => {
            let parA = elem[parameter]
            let parB = b[i][parameter]
            i++
            return (parA === parB)
        })
    }

    /** get a list of all sub-categories of question (via categoryName param) */
    getQuestionDividerName = (configuratorQuestions: Array<ConfiguratorQuestionProps>) => {
        const tDivCategories = configuratorQuestions.filter(
            (q1) => configuratorQuestions.indexOf(configuratorQuestions.find((q2) => q2['categoryName'] === q1['categoryName'])!)
            === 
            configuratorQuestions.indexOf(q1)
        )
        const tCategoryNames: Array<string> = tDivCategories.map((props) => props["categoryName"])
        return tCategoryNames
      }

    /** create a list of question sub-categories with an Array of questions for each */
    subdivideQuestions = (questionProps: Array<ConfiguratorQuestionProps>) => {
        const tQuestionCategoryNames = this.getQuestionDividerName(questionProps)
        const tQuestion = tQuestionCategoryNames.map((category) => 
            questionProps.filter((question) => 
                question['categoryName'] === category
            )
        )
        return tQuestionCategoryNames.map((category, index) => { return {title: category, questions: tQuestion[index]} })
    }

    
    /**use user id to clear the questions on refresh of the page */
    clearRefresh = () => {
        const {userID, server} = this.state;
        axios.post(`${server}/api/clearConfigurator`, {
            userId: userID,
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                    // FETCH DATA //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     /** use TemplateID to create a list of questions in backend, 
     * templateID is like the product Type and it deternines wich questions needs to be asked*/
    fillConfigurator = () => {
        const { server, userID } = this.state
        //const userId = !isNullOrUndefined(localStorage.getItem('userID')) ? localStorage.userID : ""
        axios.post(`${server}/api/fillConfigurator`, {
            userId: userID,
            nomenclatTemplateId: this.state.nomenclatTemplateId, //<---------------------------------Get_Nomencat_Config_List (ex: 158 59)
        })
        .then(res => {
            if(res.status === 200){
                logMessages( translateString("Success!"), res.status, 
                    translateString("The new product was created!"), 3000, "success" )
                this.setState({
                    isLoadingImages: true,
                    isLoading: true,
                    previewImage: 0,
                    previewProductDescription: "",
                    previewProductID: "",
                })
                this.fetchConfiguratorAll()
            }
        })
        .catch(error => {
            errorLogMessages(error) 
        })
    }

//[VL] REQUEST A QUOTE function for saving request and insert to database
    InsertButton = () => {
        const self = this
        const server = this.state.server
        const requestUrl: string = `${server}/api/insertConfigurator`;
        const requestBody: any = {
            soumNo: this.state.soumNum,
            userId: this.state.userID,
            nomenclatTemplateId : this.state.nomenclatTemplateId,
            note: this.state.note,
        };
        
        this.setState({isEmailLoading:true})
        
        axios.post(requestUrl, requestBody)
        .then(res => {
            if(res.status === 200) {
                const somNo = res.data.output.SOUM_NO
                self.SendEmail(somNo)
                this.fillConfigurator() 
            } 
        })
        .catch(err => {
            errorLogMessages(err)
            console.error(err, "Error happend whilst seending product configuration")
            this.setState({isEmailLoading:false, emailLoadingStatus:false})
        });
    }   
  
//[VL] SEND Email after quote requested
    SendEmail = (soumNo: number) => {
        const { server, userID } = this.state
        //const userId = !isNullOrUndefined(localStorage.getItem('userID')) ? localStorage.userID : ""
        axios.post(`${server}/api/insertEmail`, {
            userId: userID,
            soumNo,
        })
        .then(res => {
            if(res.status === 200){
                this.setState({isEmailLoading:false, emailLoadingStatus:true, soumNum:soumNo})
                logMessages( translateString("Success!"), res.status,
                translateString(`Request ${soumNo} has been sent successfully, you will receive a confirmation email within 48 hours`), 5000, "success" )
            }
        })
        .catch(error => {
            errorLogMessages(error)
            this.setState({isEmailLoading:false, emailLoadingStatus:false})
        })
    }
   /* [VL]     GET_NOMENCLAT_TEMPLATE_FOR_USER
           const userId = req.body.userId
           const soumNo = req.body.soumNo;
   
   logMessages( translateString("Success!"), res.status,   
                translateString("The new product was created!"), 3000, "success" )
                
           // this.setState({isLoading: true}, this.fetchConfiguratorAll)  */
    getTemplate = () => {
        const { server } = this.state;
        const TesterID = !isNullOrUndefined(localStorage.getItem('userID')) ? localStorage.userID : ""
        const self=this 
        let data = new Array()
        let userID = localStorage.userID;
        data = [`${server}/api/templateuser?userId=${TesterID}`]
           axios.all(data.map(l => axios.get(l)))
            .then(
                axios.spread(function (...res) {
                    userID= res[0].data[0]
                    self.setState ({ TesterID:userID[0],nomencalteTemplateUser:res[0].data[0]})

                }) 
            )
      }
   
      
    /** ASYNC get all questions and those question's options if applicable also get preview images*/
    fetchConfiguratorAll = async () => {
        const self = this
        let userID = localStorage.userID;
        let ApiArr = [
            `${this.state.server}/api/getConfiguratorAll?userId=${userID}`,
            `${this.state.server}/api/getConfiguratorOptionsList?userId=${userID}`,
            `${this.state.server}/api/getConfiguratorMaterialList`]
        if (userID) {
            axios.all(ApiArr.map(l => axios.get(l))).then(
                axios.spread(async function (...res) {
                    const data = res[0].data.recordsets
                    console.log(data,'FETCH DATA ALL')
                    const tSelectOptions = res[1].data
                    const tMaterialOptionsRaw = res[2].data
                    self.setState({
                        selectOptions: tSelectOptions,
                        materialOptions: tMaterialOptionsRaw,
                        configuratorDimentions: data[0], 
                        configuratorOptions: data[1], 
                        configuratorMaterial: data[2], 
                    })
                    
                    // formation raw question data into 
                    await new Promise(resolve => {
                        setTimeout(() => {
                            resolve([{title: 'ERROR PROMISE TIMEOUT', key: `ERRORTIMEOUT`,
                            type:IQuestionType.switch,  categoryName:'ERR', defaultValue: false}])}, 30000)
        
                        resolve(data[3].map((q, index) => {
                            let QuestionFieldProps: Object
                            if (q['Q_TYPE'] === 'DIM') {
                                QuestionFieldProps = data[0].find(DIM => DIM['SEQ'] === q['SEQ_OR_ID'])
                                let tProps: ConfiguratorQuestionProps =  {
                                    title: QuestionFieldProps['TITLE'], image: QuestionFieldProps['FILE_ID'], index: index, 
                                    key: `Q${QuestionFieldProps['ABREV']}${QuestionFieldProps['SEQ']}${self.state.nomenclatTemplateId}`,
                                    type:IQuestionType.number,  categoryName: q['Q_GROUP'], 
                                    optionID_or_Seq: QuestionFieldProps['SEQ'], defaultValue: QuestionFieldProps['DIM_VALUE']
                                }
                                    return tProps
                            }

                            else if (q['Q_TYPE'] === 'OPT') {
                                QuestionFieldProps = data[1].find(OPT => OPT['ID'] === q['SEQ_OR_ID'])
                                const tfilterdOptions = tSelectOptions.filter((opt) => opt['NTOID'] === QuestionFieldProps['NTOID'])
                                const tOptions = tfilterdOptions.map((opt) => {
                                    return {title: opt['DESCRIP'], value: opt['OPTION_ID']}
                                })
                                const dbValue = QuestionFieldProps["OPTION_ID"] ?  QuestionFieldProps["OPTION_ID"] : -1
                                let tProps: ConfiguratorQuestionProps = {
                                    title: QuestionFieldProps['NAME'], image: QuestionFieldProps['FILE_ID'], index: index,
                                    key: `Q${QuestionFieldProps['ABREV_CODE']}${QuestionFieldProps['ID']}${self.state.nomenclatTemplateId}`,
                                    type:IQuestionType.select,  categoryName:q['Q_GROUP'], defaultValue: dbValue, options: tOptions,
                                    optionID_or_Seq: QuestionFieldProps['ID']
                                }
                                return tProps
                            }

                            else if (q['Q_TYPE'] === 'MAT') {
                                QuestionFieldProps = data[2].find(MAT => MAT['SEQ'] === q['SEQ_OR_ID'])
                                let tProps: ConfiguratorQuestionProps = {
                                    title: QuestionFieldProps['TITLE'], image: QuestionFieldProps['FILE_ID'],
                                    key: `Q${QuestionFieldProps['ABREV']}${QuestionFieldProps['SEQ']}${self.state.nomenclatTemplateId}`,
                                    type: IQuestionType.select, categoryName:q['Q_GROUP'],
                                    optionID_or_Seq:QuestionFieldProps['SEQ'], index: index,
                                    hidden: QuestionFieldProps["MATERIAL_HIDDEN"],
                                    MaterialGradeColorOptions: {
                                        material: tMaterialOptionsRaw.map((raw) => ({title: raw.NAME, value: raw.ID})), 
                                        grade: [], 
                                        color: [],
                                        materialValue: QuestionFieldProps['MATERIAL_ID'], gradeValue: QuestionFieldProps['GRADE_ID'], colorValue: QuestionFieldProps['COLOR_DTL_ID'],
                                    },
                                    defaultValue: {material: QuestionFieldProps['MATERIAL_ID'], grade: QuestionFieldProps['GRADE_ID'], color: QuestionFieldProps['COLOR_DTL_ID']}
                                }
                                return tProps
                            }

                            else {
                                console.error("QESTION TYPE NOT FOUND CHECK ProductConfigurator.tsx > fetchConfigAll")
                                let tProps: ConfiguratorQuestionProps = {
                                    title: 'ERROR QUESTION TYPE', key: `ERRORQUESTIONTYPE${index}`, image: -1, index: 0,
                                    type: IQuestionType.switch,  categoryName: 'ERR', optionID_or_Seq: -1, defaultValue: false
                                }
                                return tProps
                            }
                        }))
                    }).then((questionPropsResults) => {
                        let tquestionProps: Array<ConfiguratorQuestionProps> = questionPropsResults as Array<ConfiguratorQuestionProps>
                        let categorisedQuestions = self.subdivideQuestions(tquestionProps)
                        self.setState({
                            isLoading: false,
                            configuratorQuestions: tquestionProps,
                            questionsSubdivide: categorisedQuestions
                        }, () => self.fillMaterialOptionsAll(false, false, true))
                    }).catch(error => {
                        errorLogMessages(error)
                    })
                })).then(() => {
            }).catch(err => {
                errorLogMessages(err)
                console.error(err)
            });

            Axios.get(`${self.state.server}/api/getConfiguratorImageList?userId=${userID}`)
            .then((res) => {
                let tImageFiles = new Object
                console.log(this.state.userID, "User Id")
                console.log(res.data, "IMAGES DATA recived from API")
                //let base64String = btoa(String.fromCharCode(...new Uint8Array(img.FILE_CONTENT.data)))
                res.data.map(img => {
                    const FileData = img.FILE_CONTENT ? img.FILE_CONTENT.data : img.FILE_CONTENT_MINI.data
                    tImageFiles[img.FILE_ID as string] = convertBufferArrayToDataURL(FileData)
                })
                console.log(tImageFiles, "IMAGES DATA populate local variable tImageFiles")
                self.setState({
                    isLoadingImages: false,
                    imageFiles: tImageFiles
                }, () => console.log(self.state.imageFiles, "IMAGES DATA post state update"))
            }).catch(err => {
                self.setState({ isLoadingImages: false })
                errorLogMessages(err)
                console.error(err)
            })
        }
    }

    /** --DEPRECATED-- used to get grade options and color options */
    fillMaterialOptionsAll = (updateGradeOnly: boolean = false, updateColorOnly: boolean = false, updateBoth: boolean = false) => {
        const self = this
        let newQdiv = this.state.questionsSubdivide
        newQdiv.map((Qd, dividerIndex) => {
            Qd.questions.map((Q, questionIndex) => {
                if(!isNullOrUndefined(Q.MaterialGradeColorOptions))
                {
                    if(updateBoth) {
                        const ApiArr = [
                            `${this.state.server}/api/getGradeForMaterial?materialId=${Q.MaterialGradeColorOptions.materialValue}`,
                            `${this.state.server}/api/getColorForMaterialAndGrade?materialId=${Q.MaterialGradeColorOptions.materialValue}&gradeId=${Q.MaterialGradeColorOptions.gradeValue? Q.MaterialGradeColorOptions.gradeValue: -1}`]

                        axios.all(ApiArr.map(l => axios.get(l))).then(
                            axios.spread(async function (...res) {
                                newQdiv[dividerIndex].questions[questionIndex].MaterialGradeColorOptions.grade = res[0].data?.map((raw) => ({title: raw.NAME, value: raw.ID}))
                                newQdiv[dividerIndex].questions[questionIndex].MaterialGradeColorOptions.color = res[1].data?.map((raw) => ({title: raw.NAME, value: raw.ID}))
                                self.setState({
                                    ...self.state,
                                    questionsSubdivide: newQdiv,
                                })
                            })
                        ).catch(err => console.error(err))
                    }
                    else {
                        if(updateGradeOnly){
                            axios.get(`${this.state.server}/api/getGradeForMaterial?materialId=${Q.MaterialGradeColorOptions.materialValue}`)
                            .then((res) => {
                                newQdiv[dividerIndex].questions[questionIndex].MaterialGradeColorOptions.grade = res.data?.map((raw) => ({title: raw.NAME, value: raw.ID}))
                                self.setState({
                                    ...self.state,
                                    questionsSubdivide: newQdiv,
                                })
                            }).catch(err => console.error(err))   
                        }
                        if(updateColorOnly){
                            axios.get(`${this.state.server}/api/getColorForMaterialAndGrade?materialId=${Q.MaterialGradeColorOptions.materialValue}&gradeId=${Q.MaterialGradeColorOptions.gradeValue? Q.MaterialGradeColorOptions.gradeValue: -1}`)
                            .then((res) => {
                                newQdiv[dividerIndex].questions[questionIndex].MaterialGradeColorOptions.color = res.data?.map((raw) => ({title: raw.NAME, value: raw.ID}))
                                self.setState({
                                    ...self.state,
                                    questionsSubdivide: newQdiv,
                                })
                            }).catch(err => console.error(err))
                        }
                    }
                }
            })
        })
    }

    /** used to get grade options and color options for "Material" questions */
    fillMaterialOptionsAuto = (dividerIndex: number, questionIndex: number) => {
        const self = this
        let tQD = this.state.questionsSubdivide
        let tMatOpt = tQD[dividerIndex].questions[questionIndex].MaterialGradeColorOptions
        //console.log(tMatOpt)
        if(tMatOpt.materialValue > 0 && tMatOpt.gradeValue < 0) {
            axios.get(`${this.state.server}/api/getGradeForMaterial?materialId=${tMatOpt.materialValue}`)
            .then((res) => {
                tQD[dividerIndex].questions[questionIndex].MaterialGradeColorOptions.grade = res.data?.map((raw) => ({title: raw.NAME, value: raw.ID}))
                //console.log(tQD[dividerIndex].questions[questionIndex].MaterialGradeColorOptions.grade, 'new grade opions')
                self.setState({
                    questionsSubdivide: tQD,
                })
            }).catch(err => console.error(err))
        }
        else if(tMatOpt.gradeValue > 0 && tMatOpt.colorValue < 0) {
            axios.get(`${this.state.server}/api/getColorForMaterialAndGrade?materialId=${tMatOpt.materialValue}&gradeId=${tMatOpt.gradeValue? tMatOpt.gradeValue: -1}`)
            .then((res) => {
                tQD[dividerIndex].questions[questionIndex].MaterialGradeColorOptions.color = res.data?.map((raw) => ({title: raw.NAME, value: raw.ID}))
                self.setState({
                    questionsSubdivide: tQD,
                })
            }).catch(err => console.error(err))
        }
    }


    fetchPermissions() {
        let userID = localStorage.userID;
        let pathName = this.state.pathArray[window.location.pathname.split('/').length - 1];
        let optionCodes: any = [];
        if (userID) {
            axios.get(`${this.state.server}/api/authorizedoptions/${userID}/${pathName}`).then((res) => {
                let data = res.data;
                if (data.length > 0) {
                    data.forEach((value: any) => {
                        optionCodes.push(value.OptionCode);
                    })
                }
                this.setState({
                    permissionCodes: optionCodes,
                })
            })
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                 // CHANGE HANDLERS //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    handleChange = (event: ChangeEvent<any>) => {
        const { name, value } = event.currentTarget
        this.setState({ ...this.state, [name]: value })
    }

    /** on mouse hover or click a question: change the info displayed in the prewiew section */
    setFocusedFieldIndex = (QProps: ConfiguratorQuestionProps) => {
        this.setState({
            ...this.state,
            previewImage: QProps.image,
            previewProductDescription: QProps.title,
            previewProductID: QProps.key,
        })
    }

    /** change handler for "options" type questions and post to database, 
     * it's possible that a a choice requires a follow-up question so the handler also recreates the configrator questions*/
    updateOptionId = (value: any, id: number) => {
        let self = this
        let { userID } = this.state
        axios.post(`${this.state.server}/api/setConfiguratorOption`, {
            userKey: userID,
            configuratorOptionId: id,
            optionValue: value, 
        })
        .then(res => {
            if (userID) {
                axios.get(`${this.state.server}/api/getConfiguratorOptions?userId=${userID}`)
                .then(res => {
                    let data = res.data
                    let isNew = !this.compareOptionsArrays(data, self.state.configuratorOptions, "ID")
                    if (isNew) {
                        this.setState({
                            isLoadingImages: true,
                        })
                        this.fetchConfiguratorAll()
                    }
                })
                .catch((err) => {
                    console.error(err)
                    this.setState({
                        isLoadingImages: true,
                        isLoading: true
                    })
                    this.fetchConfiguratorAll()
                })
            }
        })
        .catch(error => {
            errorLogMessages(error)
            console.error(error)
        })
    }

    /** change handler for "dimensions" type questions and post to database */
    updateDim = (value: any, seq: number) => {
        let { userID } = this.state
        axios.post(`${this.state.server}/api/setConfiguratorDimn`, {
            userKey: userID,
            seq: seq,
            dimValue: value,
        })
        .then(res => {
            console.log('Uploaded dimensions')
        })
        .catch(error => {
            errorLogMessages(error)
            console.error(error)  

            
        })
    }

    /** change handler for "material" type questions and send to database, 
     *  - depending on the witch option sub-type change and/or reveal the sub-question's options
     *  - material is determined by material type, grade type and color in that order
     *  - example: select Aluminium as material type reveals the grade options for aluminium, selection a grade option for aluminium will reveal the color options for aluminium and grade*/
    updateMat = (value: number|null, optionType: string, MatSeq: number, dividerIndex: number, propsIndex: number) => {
        let self = this
        let { userID } = self.state
        let matGrColOprions = self.state.questionsSubdivide[dividerIndex].questions[propsIndex].MaterialGradeColorOptions
        let MatOptionsObj
        switch(optionType)
        {
            case 'material':
                MatOptionsObj = {
                    userKey: userID,
                    configuratorMaterialSeq: MatSeq,
                    materialId: value ? value : -1,
                    gradeId: -1,
                    colorId: -1,
                    material: matGrColOprions.material ? matGrColOprions.material : null,
                    grade: matGrColOprions.grade ? matGrColOprions.grade : null,
                    color: null,
                }
                break
            case 'grade':
                const tVal = value ? value : -1
                MatOptionsObj = {
                    userKey: userID,
                    configuratorMaterialSeq: MatSeq,
                    materialId: matGrColOprions.materialValue ? matGrColOprions.materialValue : -1,
                    gradeId: tVal,
                    colorId: -1,
                    material: matGrColOprions.material ? matGrColOprions.material : null,
                    grade: matGrColOprions.grade ? matGrColOprions.grade : null,
                    color: tVal > 0 ? matGrColOprions.color : null,
                }
                break
            case 'color':
                MatOptionsObj = {
                    userKey: userID,
                    configuratorMaterialSeq: MatSeq,
                    materialId: matGrColOprions.materialValue ? matGrColOprions.materialValue : -1,
                    gradeId: matGrColOprions.gradeValue ? matGrColOprions.gradeValue : -1,
                    colorId: value ? value : -1,
                    material: matGrColOprions.material ? matGrColOprions.material : null,
                    grade: matGrColOprions.grade ? matGrColOprions.grade : null,
                    color: matGrColOprions.color ? matGrColOprions.color : null,
                }
                break
            default:
                MatOptionsObj = {
                    userKey: userID,
                    configuratorMaterialSeq: MatSeq,
                    materialId: matGrColOprions.materialValue ? matGrColOprions.materialValue : -1,
                    gradeId: matGrColOprions.gradeValue ? matGrColOprions.gradeValue : -1,
                    colorId: matGrColOprions.colorId ? matGrColOprions.colorId : -1,
                    material: matGrColOprions.material ? matGrColOprions.material : null,
                    grade: matGrColOprions.grade ? matGrColOprions.grade : null,
                    color: matGrColOprions.color ? matGrColOprions.color : null,
                }
                break
        }
        axios.post(`${this.state.server}/api/setConfiguratorMaterial`, MatOptionsObj)
        .then(res => {
            let tQD = self.state.questionsSubdivide
            tQD[dividerIndex].questions[propsIndex].MaterialGradeColorOptions = {
                ...tQD[dividerIndex].questions[propsIndex].MaterialGradeColorOptions,
                material: MatOptionsObj.material,
                grade: MatOptionsObj.grade,
                color: MatOptionsObj.color,
                materialValue: MatOptionsObj.materialId,
                gradeValue: MatOptionsObj.gradeId,
                colorValue: MatOptionsObj.colorId,}
            self.setState({questionsSubdivide: tQD}, () => {
                switch(optionType) {
                    case 'material':
                        self.fillMaterialOptionsAuto(dividerIndex, propsIndex)
                        break
                    case 'grade':
                        self.fillMaterialOptionsAuto(dividerIndex, propsIndex)
                        break
                    case 'color':
                        break
                    default:
                        self.fillMaterialOptionsAll(false, false, true)
                        break
                }
            })
        })
        .catch(error => {
            errorLogMessages(error)
            console.error(error)
        })
    }
 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                      // RENDER //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    render(){
        const { previewImage, defaultPreviewImage, productPreviewDescription, currency, nomencalteTemplateUser, isLoading } = this.state;
        return(
            <Box>
                {/*///////////////////////////////////////////////_  TITLE  _///////////////////////////////////////////////*/}
                    <Box className="font-weight-bold d-flex flex-row flex-nowrap justify-content-between align-items-center pb-2"
                    id="pageTitle"
                    style={{ fontSize: '1em' }}>
                        <Tooltip title={translateString("Help?")} placement="right">
                            <Button id="pageFontStyle" onClick={this.openInstructions}>
                                <StringTranslator>Product Configurator </StringTranslator>
                            </Button>
                        </Tooltip>
                    </Box>
                    {/*<LinkTitle openInstructions={this.openInstructions} />*/}
    
                <Grid spacing={2} container>
                {/*////////////////////////////////////_  PREVIEW, DESC. & PRODUCT ID  _////////////////////////////////////*/}
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h5"><StringTranslator>Product Name</StringTranslator></Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={5}>
                        <Box className="stickyTopNav">
                            <Grid container spacing={2}>
                                <Grid style={{height: "40vh"}} item xs={12} sm={6} md={12} lg={12}>
                                    <Card style={{height: "100%"}}>
                                        {this.state.isLoadingImages && // <-- loading animation
                                            <div className="d-flex justify-content-center m-3" style={{ position: "absolute" }}>
                                                <Typography style={{color: 'var(--secondary-color)'}} className="spinner-border spinner-border-lg" role="status"/>
                                            </div>
                                        }
                                        <CardMedia // <-- preview img
                                        component="img"
                                        title="Preview"
                                        height='100%'
                                        width='auto'
                                        style={{maxWidth: '500px', margin:'auto', objectFit: 'contain', padding: "5px"}}
                                        image={previewImage === 0 ? defaultPreviewImage : this.state.imageFiles[previewImage]}/>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={12} lg={12}>
                                    <Box display="flex" flexDirection="column" height="100%">
                                        <Box flex="1 0" marginBottom="16px">
                                            <Card style={{height: '100%'}}> {/* <-- product type select Box*/}
                                                <Box padding='8px 8px 0'>
                                                    <Typography><StringTranslator>Product Type select</StringTranslator></Typography>
                                                    <Divider/>
                                                </Box>
                                                <Box padding='8px'>
                                                    <ColorTextField
                                                        error={this.state.nomenclatTemplateId === 0}
                                                        fontWeight={600}
                                                        size="small"
                                                        id="standard-select-currency"
                                                        select
                                                        label={translateString("Please select a product")}
                                                        onChange={(e) => {
                                                                this.setState({nomenclatTemplateId: e.target.value}, this.fillConfigurator)
                                                                }
                                                            }>
                                                            {nomencalteTemplateUser.map((value) =>(
                                                                <MenuItem key={value.NAME + value.ID} value={value.ID}>{value.NAME}</MenuItem> 
                                                            ))
                                                            }
                                                    </ColorTextField>
                                                </Box>
                                            </Card>
                                        </Box>
                                        <Box flex="15 0 60px" marginBottom="16px">
                                            <Card style={{height: '100%'}}> {/* <-- Description Box*/}
                                                <Box height="100%">
                                                    <Box padding={'8px'} paddingBottom="0" height={'30px'}>
                                                        <Typography><StringTranslator>Notes</StringTranslator></Typography>
                                                        <Divider/>
                                                    </Box>
                                                    <FullSizeTextField
                                                        onChange={(e) => this.setState({note: e.target.value})}
                                                        value={this.state.note}
                                                        style={{ height: 'calc(100% - 30px)'}} label="" multiline/>
                                                </Box>
                                            </Card>
                                        </Box>
                                        <Box display='flex' style={{backgroundColor: 'white', borderRadius: '4px', boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'}}>
                                            {this.state.soumNum !== 0 &&
                                                <Tooltip title={translateString("Create new product configuration")}>
                                                    <ColorButton disabled={this.state.isEmailLoading || this.state.nomenclatTemplateId === 0} 
                                                    //style={{flex:"auto"}} 
                                                    onClick={() => {
                                                        this.setState({soumNum:0})
                                                        this.fillConfigurator()
                                                        }
                                                    }>  
                                                        <FiberNewIcon fontSize="large"/>
                                                    </ColorButton>
                                                </Tooltip>
                                            }
                                            <ColorButton disabled={this.state.isEmailLoading || this.state.nomenclatTemplateId === 0} 
                                            style={{flex:"auto", justifyContent:"flex-start"}} 
                                            onClick={() => {
                                                this.InsertButton()
                                                }
                                            }>  
                                                <CircularIntegrationComponent 
                                                    loading={this.state.isEmailLoading} 
                                                    success={this.state.emailLoadingStatus}/>
                                                {this.state.soumNum === 0 ?
                                                    <Typography variant="h6"><StringTranslator>Request a new quote</StringTranslator></Typography>
                                                :
                                                    <Typography variant="h6"><StringTranslator>Add to request #{this.state.soumNum}</StringTranslator></Typography>
                                                }
                                            </ColorButton>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                {/*////////////////////////////////////////_  QUESTIONS ACCORDION  _/////////////////////////////////////////*/}
                    <Grid item xs={12} sm={12} md={8} lg={7}>
                        {this.state.isLoading ?
                            <Card>
                                <div className="d-flex justify-content-center m-3">
                                    <Typography style={{color: 'var(--secondary-color)'}} className="spinner-border spinner-border-lg" role="status"/>
                                </div>
                            </Card>
                        :
                        this.state.questionsSubdivide.map((Qd, dividerIndex) => {
                            return (
                                <Accordion key={`Accodion#${dividerIndex}`} defaultExpanded={dividerIndex === 0} >
                                    <AccordionSummary
                                        expandIcon={<ExpandMore/>}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header" >
                                        <Typography variant="h6">{Qd.title}</Typography>
                                    </AccordionSummary>
                                    <Divider/>
                                        <Grid container spacing={2}>
                                            {Qd.questions && Qd.questions.length > 0 && Qd.questions.map(
                                                (Qprops, propsIndex) => (
                                                <Grid item xs={12} sm={12} md={12} lg={(Qprops.type === IQuestionType.radio) ? 12 : 6} onMouseEnter={() => this.setFocusedFieldIndex(Qprops)} key={Qprops.key}>
                                                    <Card style={{padding: '8px', flex: '1 0 100%', height: "100%"}} variant="outlined">
                                                        <Box display='flex' flexWrap='wrap'>
                                                            <Box><Typography>{Qprops.title}</Typography></Box>
                                                            <Box width="100%">
                                                                { isNullOrUndefined(Qprops.MaterialGradeColorOptions)
                                                                ?
                                                                    (Qprops.type === IQuestionType.number 
                                                                    || Qprops.type === IQuestionType.select 
                                                                    || Qprops.type === IQuestionType.text) ?
                                                                        <ColorTextField
                                                                            select={Qprops.type === IQuestionType.select} 
                                                                            label={translateString(Qprops.type === IQuestionType.select? 'Option' : "Dimention")} 
                                                                            type={Qprops.type === IQuestionType.number ? "number" : 'text'} 
                                                                            defaultValue={Qprops.defaultValue} 
                                                                            onChange={
                                                                                (e) => Qprops.type === IQuestionType.select ?
                                                                                this.setState({value: e.target.value}, () => this.updateOptionId(e.target.value, Qprops.optionID_or_Seq))
                                                                                :
                                                                                this.setState({value: e.currentTarget.value}, () => {this.updateDim(this.state.value, Qprops.optionID_or_Seq)})
                                                                            }
                                                                        >
                                                                            {Qprops.type === IQuestionType.select && Qprops.options && Qprops.options.length > 0 &&
                                                                                Qprops.options?.map((option) => (
                                                                                    <MenuItem key={option.value} value={option.value}>
                                                                                        {option.title}
                                                                                    </MenuItem>
                                                                                ))
                                                                            }
                                                                        </ColorTextField>
                                                                    : Qprops.type === IQuestionType.switch ? 
                                                                        <FormControlLabel
                                                                            control={
                                                                                <ColorSwitch 
                                                                                    checked={this.state[Qprops.key] ? this.state[Qprops.key] : Qprops.defaultValue === true} 
                                                                                    onChange={
                                                                                        (e) => this.setState({[Qprops.key]: e.target.checked})
                                                                                    } 
                                                                                    name="checkedA"/>
                                                                            }
                                                                            label={Qprops.title}
                                                                        />
                                                                    :
                                                                        <FormControl component="fieldset">
                                                                            <RadioGroup 
                                                                                aria-label={Qprops.title} 
                                                                                name={Qprops.title} 
                                                                                value={this.state[Qprops.key] ? this.state[Qprops.key] : Qprops.defaultValue} 
                                                                                onChange={
                                                                                    (e) => this.setState({[Qprops.key]: e.target.value})
                                                                                }>
                                                                                {Qprops.options && Qprops.options.length > 0 &&
                                                                                    Qprops.options?.map((option) => (
                                                                                        <FormControlLabel value={option.value} control={<ColorRadio size='medium'/>} label={option.title} />
                                                                                    ))
                                                                                }
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                :
                                                                    <React.Fragment> {/*<-- MATERIAL type qustion display*/}
                                                                        <ColorTextField /*<-- material options sub-question*/
                                                                            select
                                                                            label={translateString('Material')} 
                                                                            defaultValue={Qprops.defaultValue['material']} 
                                                                            value={Qprops.MaterialGradeColorOptions.materialValue}
                                                                            disabled={Qprops.hidden? true: false}
                                                                            onChange={ (e) => 
                                                                                this.updateMat(parseInt(e.target.value), 'material', Qprops.optionID_or_Seq, dividerIndex, propsIndex)
                                                                            }
                                                                        >
                                                                            <MenuItem key={-1} value={-1}>
                                                                                    {translateString('Select material')}
                                                                                </MenuItem>
                                                                            {Qprops.MaterialGradeColorOptions.material?.length > 0 && 
                                                                                Qprops.MaterialGradeColorOptions.material.map((option) => ( 
                                                                                    <MenuItem key={option.value} value={option.value}>
                                                                                        {option.title}
                                                                                    </MenuItem>
                                                                                ))
                                                                            }
                                                                        </ColorTextField>
                         
                                                                        { !isNullOrUndefined(Qprops.MaterialGradeColorOptions.grade) &&
                                                                            <ColorTextField //<-- grade options sub-question
                                                                                select
                                                                                label={translateString('Grade')} 
                                                                                defaultValue={Qprops.defaultValue['grade']}
                                                                                value={Qprops.MaterialGradeColorOptions.gradeValue}
                                                                                disabled={Qprops.hidden? true: false}
                                                                                onChange={ (e) => 
                                                                                    this.updateMat(parseInt(e.target.value), 'grade', Qprops.optionID_or_Seq, dividerIndex, propsIndex)
                                                                                }
                                                                            >
                                                                                <MenuItem key={-1} value={-1}>
                                                                                    {translateString('Select material grade')}
                                                                                </MenuItem>
                                                                                {Qprops.MaterialGradeColorOptions.grade?.length > 0 &&
                                                                                    Qprops.MaterialGradeColorOptions.grade.map((option) => (
                                                                                        <MenuItem key={option.value} value={option.value}>
                                                                                            {option.title}
                                                                                        </MenuItem>
                                                                                    ))
                                                                                }
                                                                            </ColorTextField>
                                                                        }

                                                                        { !isNullOrUndefined(Qprops.MaterialGradeColorOptions.color) &&
                                                                            <ColorTextField //<-- color options sub-question
                                                                                select
                                                                                label={translateString('Color')} 
                                                                                defaultValue={Qprops.defaultValue['color']} 
                                                                                value={Qprops.MaterialGradeColorOptions.colorValue}
                                                                                disabled={Qprops.hidden? true: false}
                                                                                onChange={ (e) => 
                                                                                    this.updateMat(parseInt(e.target.value), 'color', Qprops.optionID_or_Seq, dividerIndex, propsIndex)
                                                                                }
                                                                            >
                                                                                <MenuItem key={-1} value={-1}>
                                                                                    {translateString('Select material color')}
                                                                                </MenuItem>
                                                                                {Qprops.MaterialGradeColorOptions.color?.length > 0 &&
                                                                                    Qprops.MaterialGradeColorOptions.color.map((option) => (
                                                                                        <MenuItem key={option.value} value={option.value}>
                                                                                            {option.title}
                                                                                        </MenuItem>
                                                                                    ))
                                                                                }
                                                                            </ColorTextField>
                                                                        }
                                                                    </React.Fragment>
                                                                }
                                                            </Box>
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                                )
                                            )}
                                        </Grid>
                                </Accordion>
                            )
                        })}
                    </Grid>
                </Grid>
                {/*///////////////////////////////////////////////_  MODALS  _///////////////////////////////////////////////*/}
                    <InstructionsModal
                        showInstructionsModal={this.state.openInstructionsModal}
                        closeInstructionsModal={this.closeInstructions}
                        curWebRoute={this.state.pathArray[this.state.pathArray.length - 1]}/>
            </Box>
        )
    }
}

export default ProductConfigurator;