import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import AppUsagePage from "./pages/AppUsagePage"; // Import your page here

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/usage" component={AppUsagePage} exact />
        <Route exact path="/" render={() => <Redirect to="/usage" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
