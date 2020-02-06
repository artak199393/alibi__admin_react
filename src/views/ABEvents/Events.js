import React, { Component } from 'react';
import {Row, Table, FormGroup,Input,Label,Button} from 'reactstrap';
import moment from 'moment';
import {api} from './../../services/API';
import { Link } from 'react-router-dom';
import '../AdminPanel.css';
import EventV1 from './EventV1'
import EventsNav from './EventsNav';
import './EventsStyle.css';



class Events extends Component {
    constructor(props){
        super(props);
            this.renderTable = this.renderTable.bind(this);
            this.togglePreviw = this.togglePreviw.bind(this);
            this.state={
                testCount:0,
                events :[],
                showHeaderPreview: false,
                headerPreviewData: null
            }; 
        };
componentDidMount(){
    api.get('/events').then(res=>{
        const events = res.data;

        this.setState({events});
        })
        
        setInterval(()=>{
            this.addCount();
        },2000);
    }
togglePreviw(data = null) {
        const { showHeaderPreview } = this.state;
        let headerPreviewData = {};
            if(!showHeaderPreview && data !== null ){
                headerPreviewData = this.getParsent(data);
            }
        this.setState({
            headerPreviewData,
            showHeaderPreview: !this.state.showHeaderPreview
        });   
    }
getParsent(data){
    let headers={
        title: "",
        descriptions:[],
        contacts : []
          };
        const dataJson=JSON.parse(data);
            for(let item of dataJson){
                if(item.type =='companyDescription'){
                    if(item.title!== undefined && item.title === true){
                    headers.title = item.text;  
                    }else{
                        headers.descriptions.push(item.text)
                    }
                }
                if(item.type == 'companyContacts'){
                headers.contacts.push(item)
                }   
            }
            return headers
        }
    renderTable() {
        const _this = this;
            return(
                
                <Table responsive className='eventsTable'>
                        <thead>
                            <tr>
                                <th>
                                    <FormGroup check className="checkbox">
                                        <Input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="checkbox1" 
                                        name="checkbox1" 
                                        value="option1"
                                        />
                                        <Label check className="form-check-label" htmlFor="checkbox1"></Label>
                                    </FormGroup>
                                </th>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Discription</th>
                                <th>Label</th>
                                <th>creation <br/>data</th>
                                <th>Header<br/> tamblet</th>
                                <th>
                                    <Link to={'/events/create'} >
                                        <i className="fa fa-plus"/>&nbsp;CREATE
                                    </Link>
                                </th>
                                <th>    
                                    <Link to={`#`}>
                                        <i className="fa fa-download "/>&nbsp;EXPORT
                                    </Link>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.events.map(function(el){
                                return (
                                    <tr key={el.id.toString()}>
                                        <td>
                                            <FormGroup check className="checkbox">
                                                <Input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="checkbox1" 
                                                name="checkbox1" 
                                                value="option1" />
                                                <Label check className="form-check-label" htmlFor="checkbox1"></Label>
                                            </FormGroup>
                                        </td>
                                        <td>{el.id}</td>
                                        <td>{el.name}</td>
                                        <td dangerouslySetInnerHTML={{__html: el.description}}/>
                                        <td dangerouslySetInnerHTML={{__html: el.label}}/>
                                        <td>{moment(el.creationDate).format("DD.MM.YYYY")}</td>
                                        <td>
                                            <Button block outline color="info" 
                                            onClick={()=>{_this.togglePreviw(el.headerTemplate)}}>
                                            SHOW<br/>
                                            HEADER<br/>
                                            PREVIEW
                                            </Button>
                                        </td>
                                        <td><Link to='#'className="btn btn-primary">
                                                <i className="fa fa-pencil">&nbsp;EDIT</i></Link>
                                        </td>
                                        <th>
                                        <Link to='#' className="btn btn-primary"><i className="fa fa-eye">&nbsp;SHOW</i></Link>
                                        </th>
                                    </tr>
                                )
                                })
                                }
                        </tbody>
                    </Table>);
    }
    
    renderHeaderPreview(){
        return(
            <div className='showHeader'>
                <h2>Case header preview</h2>
                <div className='showHeaderBlok'>
                <h1>{this.state.headerPreviewData.title}</h1>
                {this.state.headerPreviewData.descriptions.map((el)=>{
                    return(<h6 key={el}>{el}</h6>)
                })}
                <div className='headerContacts'>
                 {this.state.headerPreviewData.contacts.map((el)=>{
                    return(<span key={el.text + el.type }>{el.text}</span>)
                })}
                </div>
                </div> 
                <div className='buttonCLoss'>
                <Button block color="primary" aria-pressed="true" onClick={()=>{ this.togglePreviw()}}>clos</Button>
                </div>
            </div>
        );
    }
addCount(){
    this.setState({testCount: ++this.state.testCount});
}
    render() {
        return (
            <div>
                <EventsNav/>
                <EventV1 {...this.props}/>
                {/* <Row>
                    { !this.state.showHeaderPreview ? this.renderTable() : this.renderHeaderPreview() }
                </Row> */}
            </div>
        );
    }
}

export default Events;
