import { Switch, Route, Router as WouterRouter } from "wouter";
import LoginPage from "@/pages/login";
import CoursesPage from "@/pages/courses";
import EditCoursePage from "@/pages/edit";
import NewCoursePage from "@/pages/new";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/new" component={NewCoursePage} />
      <Route path="/courses/:id" component={EditCoursePage} />
      <Route path="/" component={CoursesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
