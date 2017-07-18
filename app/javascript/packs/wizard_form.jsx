import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Breadcrumb, Spin, Icon, Input, Card, Col, Row } from 'antd';
import { Popconfirm, Button, AutoComplete } from 'antd';
import { Table } from 'antd';
import axios from 'axios';
import WrappedRegistrationForm from './wizard_main_form';
const AutoCompleteOption = AutoComplete.Option;
let token = document.getElementsByName('csrf-token')[0].getAttribute('content');
axios.defaults.headers.common['X-CSRF-Token'] = token;
axios.defaults.headers.common['Accept'] = 'application/json';


class AvatarForm extends React.Component {
    render() {
        return (
            <Card  bodyStyle={{ padding: 0 }}>
              <div className="custom-image">
                <img alt="example"  width="100%" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
              </div>
              <div className="custom-card">

              </div>
            </Card>
        );
    }
}

class WizardForm extends React.Component {

   state = {
    result: [],
    station: {},
    user: {},
    loading: false,
    count: 0,
    dataSource: []
  }

  componentWillMount() {
    this.fetch();
  }

  fetch = () => {
    axios.get('/admin/wizards/fetch_station')
      .then((response) => {
        let station = response.data.station;
        let user = response.data.user;
        this.setState({ station: station, user: user, loading: true });
      });
  }

  onCellChange = (index, key) => {
      //TODO сделать так, чтобы изменялись актуальные данные,
      // то есть индекс проставлялся правильно, щас он не правильно, так
      // как скрытые значения не учитываются
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }

  onDelete = (index, record) => {
    const dataSource = [...this.state.dataSource];
    //dataSource.splice(index, 1);
    //dataSource[index]["_destroy"] = 1;
    let x = dataSource.find((service) => (service.id == record.id));
    x['_destroy'] = 1;
    this.setState({ dataSource });
  }

  saveUser = (user) => {
    axios.post(`/admin/wizards`, {
    params: {
    user: user,
    }
  })
  .then(function (response) {
    console.log('otvet', response);
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  addSource = (service, price) => {
    console.log('im start');
    console.log('add source service', service);
    const dataSource = [...this.state.dataSource];
    const count = dataSource.length;
    const newData = {
      key: count,
      id: service.id,
      name: service.name,
      service: service,
      price: price ? price : 32
    };

    this.setState({
      dataSource: [...dataSource, newData]
    });
  }

  render() {
       if (!this.state.loading) {
          return <Spin size="large" />;
      }
      return (
          <div>

            <Row gutter={48}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <AvatarForm/>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                <Card>
                  <WrappedRegistrationForm
                    user={this.state.user}
                    station={this.state.station}
                    onSubmit={this.saveUser} />
                </Card>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={24}>
                <Card>
                  <EditableTable source={this.state.dataSource}
                                 onCellChange={this.onCellChange}
                                 onDelete={this.onDelete}
                                 addSource={this.addSource}
                  />
                </Card>
              </Col>
             </Row>
          </div>
      );
  }
}



import { Form } from 'antd';

const FormItem = Form.Item;


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class EditableCell extends React.Component {

  state = {
    value: this.props.value,
    editable: false
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });

  }

  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }

  edit = () => {
    this.setState({ editable: true });
  }

  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

class EditableTable extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [{
      title: 'name',
      dataIndex: 'name',
      width: '50%',
      render: (text, record, index) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(index, 'name')}
        />
      ),
    }, {
      title: 'price',
      width: '25%',
      dataIndex: 'price',
    },
     {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record, index) => {
          console.log('text, record, index', text, record, index);
        if (record._destroy) { return null };
        return (
          this.filteredSource().length > 1 ?
          (
            <Popconfirm title="Sure to delete?" okText="Yes" cancelText="No" onConfirm={() => this.onDelete(index, record)}>
             <Button type="danger">Delete</Button>
            </Popconfirm>
          ) : null
        );
      },
    }];
  }

  filteredSource = () => {
      return this.props.source.filter(service => (!service._destroy));
  }

  onCellChange = (index, key) => {
    this.props.onCellChange(index, key);
  }

  onDelete = (index, record) => {
    this.props.onDelete(index, record);
  }

  handleAdd = (service, price) => {
   console.log('start');
   console.log('service start', service);
   this.props.addSource(service, price);
  }

  render() {
    const columns = this.columns;
    const filteredSource = this.props.source.filter(service => (!service._destroy));

    return (
      <div>
        <WrappedHorizontalLoginForm onAfterSubmit={this.handleAdd}/>
        <Table bordered dataSource={filteredSource} columns={columns} />
      </div>
    );
  }
}
















class HorizontalLoginForm extends React.Component {
  state = {
    autoCompleteResult: [],
    service: {}
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

   onSelect = (value, option) => {
    console.log('value on select', value);
    console.log('option.props.start', option.props.start);
    this.setState({service: option.props.start});
    //this.props.form.setFieldsValue({'serviceName': value});
  }

  handleServiceChange = (value) => {
    let autoCompleteResult;
    if (value && value.length >= 3) {
      axios.get('/admin/wizards/search', { params: { search: value } })
        .then((response) => {
           autoCompleteResult = response.data.result;
            this.setState({ autoCompleteResult });
        });
    } else {
      autoCompleteResult = [];
      this.setState({ autoCompleteResult });
    }
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });

    this.props.onAfterSubmit(this.state.service, this.props.form.getFieldValue('price') );
    this.props.form.setFieldsValue({
      serviceName: '',
      price: ''
    });
    this.props.form.validateFields();

  }

  checkPrice = (rule, value, callback) => {
    const form = this.props.form;
    if (value && Number.isform.getFieldValue('price')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { autoCompleteResult } = this.state;
    // Only show error after a field is touched.
    const serviceNameError = isFieldTouched('serviceName') && getFieldError('serviceName');
    const priceError = isFieldTouched('price') && getFieldError('price');
    const stationOptions = autoCompleteResult.map(service => (
      <AutoCompleteOption key={service.id} start={service} value={String(service.id)}>{service.name}</AutoCompleteOption>
    ));
      const formItemLayout = {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
        lg: { span: 0 },
        md: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 22 },
        lg: { span: 22 },
        md: { span: 22 },
        sm: { span: 22 },
      } }
    return (
       <Form  onSubmit={this.handleSubmit}>
        <Row>
        <Col span={12}>
          <FormItem
             {...formItemLayout}
             validateStatus={serviceNameError ? 'error' : ''}
             help={serviceNameError || ''}
            >

            {getFieldDecorator('serviceName', {
                rules: [{ required: true, message: 'Please input your skills!' }],
                })(

                 <AutoComplete
                    dataSource={stationOptions}
                    style={{marginTop: -14}}
                    placeholder={'Start input service'}
                    onSearch={this.handleServiceChange}
                    onSelect={this.onSelect}
                 >
                </AutoComplete>
            )}

          </FormItem>
         </Col>
        <Col span={6}>
            <FormItem
              {...formItemLayout}
              validateStatus={priceError ? 'error' : ''}
              help={priceError || ''}
            >
            {getFieldDecorator('price', {
                rules: [{required: true, message: 'Please input your price!' }]

            })(
                <Input prefix={<Icon type="wallet" style={{ fontSize: 13 }} />} type="number" placeholder="Price" />
            )}
        </FormItem>
            </Col>

        <Col offset={1}>
        <FormItem>
          <Button
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Add
          </Button>
        </FormItem>
        </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<WizardForm/>, document.getElementById('w'));
});
