import React, { Component } from 'react';
import { SafeAreaView} from 'react-native';
import Spinner from '../components/Spinner';
import SelectableList from '../components/SelectableList/SelectableList';
import { connect } from 'react-redux';
import Actions from '../actions';

import apiService from '../services/api';

class SelectPlantScreen extends Component {
  static navigationOptions = () => ({
    header: null
  });
  constructor(props) {
    super(props);
    this.state = {
      plants: []
    };

    this.onSelectPlant = this.onSelectPlant.bind(this);
    this.navigateToNext = this.navigateToNext.bind(this);
    this.canFinish = this.canFinish.bind(this);
  }

  componentDidMount() {
    apiService.getPlants().then(plants => {
      this.setState({ plants });
    });
  }

  onSelectPlant(item) {
    this.props.setPlant(item);

    this.props.setProject({ Id: -1, Title: 'ALL' });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.plant != this.props.plant && this.canFinish()) {
      this.navigateToNext();
    }
  }

  canFinish() {
    return this.props.plant != null;
  }

  navigateToNext() {
    this.props.navigation.state.params.onFinish();
  }

  render() {
    if (!this.state.plants.length) {
      return <Spinner text="Loading your plants" />;
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SelectableList
          items={this.state.plants}
          canFinish={this.canFinish()}
          selected={this.props.plant}
          onFinish={this.navigateToNext}
          finishTitle="Select"
          title="Select plant"
          onSelect={(item, index) => {
            this.onSelectPlant(item);
          }}
        />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setPlant: ({ Id, Title }) => dispatch(Actions.setPlant({ Id, Title })),
  setProject: ({ Id, Title }) => dispatch(Actions.setProject({ Id, Title }))
});

const mapStateToProps = state => ({
  plant: state.Main.appData.plant,
  project: state.Main.appData.project
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectPlantScreen);
