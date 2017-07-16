import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Breadcrumb, Spin, Icon, Input, Card, Col, Row } from 'antd';
import { Popconfirm, Button } from 'antd';
import { Table } from 'antd';
import axios from 'axios';
import WrappedRegistrationForm from './wizard_main_form';


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
    loading: false
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
                    />
                </Card>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={24}>
                <Card>
                  <EditableTable />
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
    editable: false,
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

      render: (text, record, index) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(index, 'name')}
        />
      ),
    }, {
      title: 'price',
      width: '10%',
      dataIndex: 'price',
    },
     {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 1 ?
          (
            <Popconfirm title="Sure to delete?" okText="Yes" cancelText="No" onConfirm={() => this.onDelete(index)}>
             <Button type="danger">Delete</Button>
            </Popconfirm>
          ) : null
        );
      },
    }];

    this.state = {
      dataSource: [{
        key: '0',
        name: 'Edward King 0',
        price: '32',
      }, {
        key: '1',
        name: 'Edward King 1',
        price: '32',
      }],
      count: 2,
    };
  }
  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }
  onDelete = (index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
  handleAdd = (name, price) => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: name ? name : `Edward King ${count}`,
      price: price ? price : 32,

    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>

        <WrappedHorizontalLoginForm onAfterSubmit={this.handleAdd}/>
        <Table bordered dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

class HorizontalLoginForm extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    this.props.onAfterSubmit(this.props.form.getFieldValue('userName'), this.props.form.getFieldValue('password') );
    this.props.form.setFieldsValue({
      userName: '',
      password: ''
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

    // Only show error after a field is touched.
    const serviceNameError = isFieldTouched('serviceName') && getFieldError('serviceName');
    const priceError = isFieldTouched('price') && getFieldError('price');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem
          validateStatus={serviceNameError ? 'error' : ''}
          help={serviceNameError || ''}
        >
          {getFieldDecorator('serviceName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(

            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />

          )}
        </FormItem>
        <FormItem
          validateStatus={priceError ? 'error' : ''}
          help={priceError || ''}
        >
          {getFieldDecorator('price', {
            rules: [{required: true, message: 'Please input your price!' },
            ],

          })(
            <Input prefix={<Icon type="wallet" style={{ fontSize: 13 }} />} type="number" placeholder="Price" />
          )}
        </FormItem>

        <FormItem>
          <Button

            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Add
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<WizardForm/>, document.getElementById('w'));
});
