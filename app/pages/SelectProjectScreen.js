import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import Spinner from '../components/Spinner';
import SelectableList from '../components/SelectableList/SelectableList';
import { connect } from 'react-redux';
import Actions from '../actions';

import apiService from '../services/api';

class SelectProjectScreen extends Component {
  static navigationOptions = () => ({
    header: null
  });
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
    this.onSelectProject = this.onSelectProject.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  componentDidMount() {
    apiService.getProjects().then(projects => {
      this.setState({ projects });
    });
  }

  onSelectProject(item) {
    this.props.setProject(item);
  }

  canFinish = () => {
    return this.props.project != null && this.props.project.Id != -1;
  }

  onFinish() {
    this.props.navigation.state.params.onFinish();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.project != this.props.project) {
      this.onFinish();
    }
  }

  render() {
    if (!this.state.projects.length) {
      return <Spinner text="Loading your projects" />;
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SelectableList
          items={this.state.projects.map(item => ({
            Id: item.Id,
            Title: item.Description
          }))}
          onFinish={this.onFinish}
          canFinish={this.canFinish()}
          title="Select"
          selected={this.props.project}
          onSelect={(item, index) => {
            this.onSelectProject(item);
          }}
        />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setProject: item => dispatch(Actions.setProject(item)),
  endOnboarding: () => dispatch(Actions.endOnboarding())
});

const mapStateToProps = state => ({
  project: state.Main.appData.project
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectProjectScreen);
