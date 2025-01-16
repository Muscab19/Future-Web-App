import {Routes, Route} from "react-router-dom"
import Home from "./Components/Home"
import Dashboard from "./Components/Dashboard"
import NewCustomer from "./Pages/NewCustomer"
import Customers from "./Pages/Customers"
import SolvedRepairs from "./Pages/SolvedRepairs"
import UnsolvedRepairs from "./Pages/UnsolvedRepairs"
import TakenRepairs from "./Pages/TakenRepairs"
import TechnicianPerformance from "./Pages/TechnicianPerformance"
import AllCustomers from "./Pages/AllCustomers"
import ServiceBudget from "./Pages/ServiceBudget"
import ItemCost from "./Pages/ItemCost"
import ItemProfit from "./Pages/ItemProfit"
import SignIn from "./Components/SignIn"
import SignUp from "./Components/SignUp"
import Messages from "./Components/messages"
import InventoryPage from "./Pages/InventoryPage"
import Invoice from "./Pages/Invoice"
import ExpensesPage from "./Pages/ExpensesPage"


function Apps () {
    return <Routes>
        <Route path="/" element={ <Home />}></Route>
        <Route path="/dashboard" element={ <Dashboard /> }></Route>
        <Route path="/newCustomer" element={ <NewCustomer /> }></Route>
        <Route path="/customers" element={ <Customers /> }></Route>
        <Route path="/solvedRepairs" element={ <SolvedRepairs /> }></Route>
        <Route path="/unsolvedRepairs" element={ <UnsolvedRepairs /> }></Route>
        <Route path="/takenRepairs" element={ <TakenRepairs /> }></Route>
        <Route path="/technicianPerformance" element={ <TechnicianPerformance /> }></Route>
        <Route path="/allCustomers" element={ <AllCustomers />}></Route>
        <Route path="/serviceBudget" element={ <ServiceBudget />}></Route>
        <Route path="/itemCost" element={ <ItemCost />}></Route>
        <Route path="/itemProfit" element={ <ItemProfit />}></Route>
        <Route path="/signIn" element={ <SignIn />}></Route>
        <Route path="/signUp" element={ <SignUp />}></Route>
        <Route path="/messages" element={ <Messages />}></Route>
        <Route path="/inventoryPage" element={ <InventoryPage /> }></Route>
        <Route path="/invoice" element={ <Invoice />}></Route>
        <Route path="/expensesPage" element={ <ExpensesPage />}></Route>
    </Routes>
}

export default Apps 