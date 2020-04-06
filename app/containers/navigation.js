import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';

import LoginScreen from '../pages/LoginScreen';
import LogoutScreen from '../pages/LogoutScreen';
import DefaultScreen from '../pages/Search/DefaultSearchScreen';
import SettingsScreen from '../pages/SettingsScreen';
import AboutScreen from '../pages/AboutScreen';
import SelectPlantScreen from '../pages/SelectPlantScreen';
import SelectProjectScreen from '../pages/SelectProjectScreen';
import IntegrityCheckScreen from '../pages/IntegrityCheckScreen';

// MC Package
import McPackageDetails from '../pages/MCPackage/MCPackageScope';
import PunchList from '../pages/MCPackage/MCPackagePunchList';

// WorkOrder
import WorkOrderDetails from '../pages/WorkOrder/WorkOrderScreen';
import WorkOrderPunchList from '../pages/WorkOrder/WorkOrderPunchList';

// PurchaseOrder
import PurchaseOrderDetails from '../pages/PurchaseOrder/PurchaseOrderScreen';
import PurchaseOrderPunchList from '../pages/PurchaseOrder/PurchaseOrderPunchList';

// Tag
import TagDetails from '../pages/Tag/TagScreen';
import TagPunchList from '../pages/Tag/TagPunchList';

// MCCR
import MCCRView from '../pages/MCCR/Checklist/MCCRContainerView';
import TagInfoView from '../pages/MCCR/TagInfo/TagInfoView';
import MCCRPunchlistView from '../pages/MCCR/Punchlist/MCCRPunchlistView';

import PreservationChecklistView from '../pages/Preservation/Checklist';
import PreservationTagInfoView from '../pages/Preservation/TagInfo';
import PreservationPunchlistView from '../pages/Preservation/Punchlist';

// PunchItemDetails
import PunchItemDetailsView from '../Modules/PunchItemDetailsView/Details'
import PunchItemTagInfo from '../Modules/PunchItemDetailsView/TagInfo'

// Saved Search checklists
import SavedSearchChecklistView from '../pages/SavedSearchResults/ChecklistsResultView';
import SavedSearchPunchItemsView from '../pages/SavedSearchResults/PunchItemsResultView';

import Color from '../stylesheets/colors';
import { StyleSheet } from 'react-native';

const commonOptions = {
  headerTitleStyle: {
    color: Color.TEXT_COLOR
  },
  headerStyle: {
    backgroundColor: '#fff',
    height: 40,
    backgroundColor: Color.HEADER_BACKGROUND,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerBackTitle: 'Back',
  headerBackTitleVisible: true,
  headerBackTitleStyle: {
    color: Color.TEXT_COLOR,
    paddingRight: 20
  },
  headerTintColor: Color.TEXT_COLOR
};

const McRoute = createBottomTabNavigator(
  {
    McPackageDetails: { screen: McPackageDetails },
    McPunchList: { screen: PunchList }
  },
  {
    initialRouteName: 'McPackageDetails',
    lazy: false,
    tabBarOptions: {
      activeTintColor: '#3A85B3',
      inactiveTintColor: '#243746',
      activeBackgroundColor: '#F3F8FC',
      style: {
        height: 56,
        backgroundColor: '#FFF'
      }
    },
    navigationOptions: {
      title: 'MC Package'
    }
  }
);

const MCCRRoute = createBottomTabNavigator(
  {
    Checklist: { screen: MCCRView },
    MCCRPunchlist: {screen: MCCRPunchlistView },
    TagInfo: {screen: TagInfoView}
  },
  {
    initialRouteName: 'Checklist',
    lazy: false,
    tabBarOptions: {
      activeTintColor: '#3A85B3',
      inactiveTintColor: '#243746',
      activeBackgroundColor: '#F3F8FC',
      style: {
        height: 56,
        backgroundColor: '#FFF'
      }
    },
    navigationOptions: {
      header: null,
      title: 'MCCR',
    }
  }
);

const PreservationRoute = createBottomTabNavigator(
  {
    PreservationChecklist: { screen: PreservationChecklistView },
    PreservationPunchList: { screen: PreservationPunchlistView },
    PreservationTagInfo: { screen: PreservationTagInfoView }
  },
  {
    initialRouteName: 'PreservationChecklist',
    lazy: false,
    tabBarOptions: {
      activeTintColor: '#3A85B3',
      inactiveTintColor: '#243746',
      activeBackgroundColor: '#F3F8FC',
      style: {
        height: 56,
        backgroundColor: '#FFF'
      }
    },
    navigationOptions: {
      header: null,
      title: 'Preservation',
    }
  }
);

const WorkOrderRoute = createBottomTabNavigator(
  {
    WorkOrderDetails: { screen: WorkOrderDetails },
    WorkOrderPunchList: { screen: WorkOrderPunchList }
  },
  {
    initialRouteName: 'WorkOrderDetails',
    lazy: false,
    tabBarOptions: {
      activeTintColor: '#3A85B3',
      inactiveTintColor: '#243746',
      activeBackgroundColor: '#F3F8FC',
      style: {
        height: 56,
        backgroundColor: '#FFF'
      }
    },
    navigationOptions: {
      title: 'Work Order'
    }
  }
);

const PurchaseOrderRoute = createBottomTabNavigator(
  {
    PurchaseOrderDetails: { screen: PurchaseOrderDetails },
    PurchaseOrderPunchList: { screen: PurchaseOrderPunchList }
  },
  {
    initialRouteName: 'PurchaseOrderDetails',
    lazy: false,
    tabBarOptions: {
      activeTintColor: '#3A85B3',
      inactiveTintColor: '#243746',
      activeBackgroundColor: '#F3F8FC',
      style: {
        height: 56,
        backgroundColor: '#FFF'
      }
    },
    navigationOptions: {
      title: 'Purchase Order'
    }
  }
);

const TagRoute = createBottomTabNavigator(
  {
    TagDetails: { screen: TagDetails },
    TagPunchList: { screen: TagPunchList }
  },
  {
    initialRouteName: 'TagDetails',
    lazy: false,
    tabBarOptions: {
      activeTintColor: '#3A85B3',
      inactiveTintColor: '#243746',
      activeBackgroundColor: '#F3F8FC',
      style: {
        height: 56,
        backgroundColor: '#FFF'
      }
    },
    navigationOptions: {
      title: 'Tag'
    }
  }
);

const PunchItemDetailsRoute = createBottomTabNavigator(
  {
    PunchItemDetails: {screen: PunchItemDetailsView },
    PunchItemTagDetails: {screen: PunchItemTagInfo }
  },{
    tabBarOptions: {
      activeTintColor: '#3A85B3',
      inactiveTintColor: '#243746',
      activeBackgroundColor: '#F3F8FC',
      style: {
        height: 56,
        backgroundColor: '#FFF'
      }
    },
    lazy: true,
    initialRouteName: 'PunchItemDetails',
    navigationOptions: {
      title: 'Punch Item'
    }
  }
)

const MainRoute = createStackNavigator(
  {
    Default: { screen: DefaultScreen },
    Settings: { screen: SettingsScreen },
    SelectPlant: { screen: SelectPlantScreen },
    SelectProject: { screen: SelectProjectScreen },
    About: { screen: AboutScreen },
    McRoute: McRoute,
    PurchaseOrderRoute: PurchaseOrderRoute,
    WorkOrderRoute: WorkOrderRoute,
    MCCRRoute: MCCRRoute,
    PreservationRoute: PreservationRoute,
    TagRoute: TagRoute,
    PunchItemDetails: PunchItemDetailsRoute,
    SavedSearchChecklist: SavedSearchChecklistView,
    SavedSearchPunchItems: SavedSearchPunchItemsView
  },
  {
    navigationOptions: commonOptions,
    initialRouteName: 'Default'
  }
);

const SetupRoute = createStackNavigator(
  {
    IntegrityCheck: { screen: IntegrityCheckScreen },
    SelectPlant: { screen: SelectPlantScreen },
    SelectProject: { screen: SelectProjectScreen }
  },
  {
    navigationOptions: commonOptions,
    initialRouteName: 'IntegrityCheck',
    headerMode: 'none'
  }
);

const LoginRoute = createStackNavigator(
  {
    Login: { screen: LoginScreen }
  },
  {
    navigationOptions: commonOptions,
    headerMode: 'none'
  }
);

const LogoutRoute = createStackNavigator(
  {
    Logout: { screen: LogoutScreen }
  },
  {
    navigationOptions: commonOptions,
    headerMode: 'none'
  }
);

const App = createSwitchNavigator(
  {
    LoginRoute,
    SetupRoute,
    MainRoute,
    LogoutRoute
  },
  {
    initialRouteName: 'LoginRoute'
  }
);

export default createAppContainer(App);
