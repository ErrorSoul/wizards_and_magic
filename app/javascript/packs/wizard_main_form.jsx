import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const Opton = AutoComplete.Option;
const { TextArea } = Input;
import axios from 'axios';

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    user: this.props.user,
    station: this.props.station
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onSubmit(values);
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  onClick =(e) => {
      this.props.form.setFieldsValue({station_id: this.state.station.name});
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  onSelect = (value) => {
    console.log('value on select', value);
    this.props.form.setFieldsValue({station_id: value});
  }

  handleStationChange = (value) => {
    let autoCompleteResult;

    if (value && value.length >= 3) {
      axios.get('/mains/photo', { params: { search: value } })
        .then((response) => {
           autoCompleteResult = response.data.result;
           this.setState({ autoCompleteResult });
        });
    } else {
      autoCompleteResult = [];
      this.setState({ autoCompleteResult });
    }
  }

  setAutoValue = (value) => {
      this.props.form.setFieldsValue({station: value});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };


    const stationOptions = autoCompleteResult.map(station => (
      <AutoCompleteOption key={station.id} value={String(station.id)}>{station.name}</AutoCompleteOption>
    ));

    const user = this.state.user;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="First name"
          hasFeedback
        >
          {getFieldDecorator('first_name', {
            initialValue: user.first_name,
            rules: [{
              required: true, message: 'Please input your name!',
            }],
          })(
            <Input />
          )}
        </FormItem>

       <FormItem
          {...formItemLayout}
          label="Last name"
          hasFeedback
        >
          {getFieldDecorator('last_name', {
            initialValue: user.last_name,
            rules: [{
              required: true, message: 'Please input your surname!',
            }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="About me"
          hasFeedback
        >
          {getFieldDecorator('about_me', {
            initialValue: user.about_me || '',
            rules: [{
              required: true, message: 'Need info!',
            }],
          })(
            <TextArea rows={4}/>
          )}
        </FormItem>

          {getFieldDecorator('station_id', {
            initialValue: this.state.station.id,
            rules: [{ required: true, message: 'Please input metro station!' }],
          })(
          <Input type="hidden"/>
          )}

        <FormItem
          {...formItemLayout}
          label="Metro"
          hasFeedback
        >
          {getFieldDecorator('station_name', {
            initialValue: this.state.station.name,
            rules: [{ required: true, message: 'Please input metro station!' }],
          })(

            <AutoComplete
               dataSource={stationOptions}
               onSearch={this.handleStationChange}
               placeholder="Input your station"
               onSelect={this.onSelect}
            >
              <Input value={this.state.station.id}/>
            </AutoComplete>
          )}
        </FormItem>


        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">Register</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default WrappedRegistrationForm;
