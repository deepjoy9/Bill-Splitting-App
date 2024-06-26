import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GroupContext } from "../context/GroupContext";
import { ExpenseContext } from "../context/ExpenseContext";
import AddExpense from "../components/AddExpense";
import AddMembers from "../components/AddMembers";
import ExpenseCard from "../components/ExpenseCard";
import GroupMembers from "../components/GroupMembers";
import ActivityCard from "../components/ActivityCard";
import { ActivityContext } from "../context/ActivityContext";
import { useParams } from "react-router-dom";
import ExpenseList from "../components/ExpenseList";
import ActivityList from "../components/ActivityList";
import ExpenseSummary from "../components/ExpenseSummary";

const GroupDetailsPage = () => {
  const { id } = useParams();
  const { groups } = useContext(GroupContext);
  const { expenses } = useContext(ExpenseContext);
  const { activityLog } = useContext(ActivityContext);

  const [modalState, setModalState] = useState({
    addMembers: false,
    addExpense: false,
    viewMembers: false,
  });

  const [activeTab, setActiveTab] = useState("expenses");
  const [groupActivities, setGroupActivities] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [groupSummary, setGroupSummary] = useState([]);

  const toggleModal = useCallback((modalName) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalName]: !prevState[modalName],
    }));
  }, []);

  useEffect(() => {
    const filteredActivities = activityLog.filter(
      (activity) => activity.groupId === id
    );
    setGroupActivities(filteredActivities);

    const filteredExpenses = expenses.filter(
      (expense) => expense.groupId === id
    );
    setGroupExpenses(filteredExpenses);
    setGroupSummary(filteredExpenses);
  }, [activityLog, expenses, id]);

  const group = useMemo(
    () => groups.find((group) => group.groupId === id) || {},
    [groups, id]
  );

  const groupMembers = useMemo(() => group.groupMembers || [], [group]);

  return (
    <div className="group-details-page">
      <h2>Group Name: {group?.name}</h2>

      {/* Buttons */}
      <div className="group-tab-buttons">
        <button onClick={() => toggleModal("viewMembers")}>View Members</button>
        <button onClick={() => toggleModal("addMembers")}>Add Members</button>
        <button onClick={() => toggleModal("addExpense")}>Add Expense</button>
      </div>

      {/* View Group Members modal */}
      <div>
        {modalState.viewMembers && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => toggleModal("viewMembers")}
              ></span>
              <GroupMembers
                groupMembers={groupMembers}
                toggleModal={() => toggleModal("viewMembers")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add New Members modal */}
      <div>
        {modalState.addMembers && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => toggleModal("addMembers")}
              ></span>
              <AddMembers
                toggleModal={() => toggleModal("addMembers")}
                alreadyAddedMembers={groupMembers}
                groupId={id}
                groupMembers={groupMembers}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Expense modal */}
      <div>
        {modalState.addExpense && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => toggleModal("addExpense")}
              ></span>
              <AddExpense
                toggleModal={() => toggleModal("addExpense")}
                groupId={id}
                groupMembers={groupMembers}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}

      <div className="group-tabs">
        <div className="group-tab-buttons">
          <button
            onClick={() => {
              setActiveTab("expenses");
            }}
            className={activeTab === "expenses" ? "active" : ""}
          >
            View Expenses
          </button>
          <button
            onClick={() => {
              setActiveTab("summary");
            }}
            className={activeTab === "summary" ? "active" : ""}
          >
            View Summary
          </button>
          <button
            onClick={() => {
              setActiveTab("activity");
            }}
            className={activeTab === "activity" ? "active" : ""}
          >
            View Activity
          </button>
        </div>

        {/* Display all list of Expenses */}
        <ExpenseList expenses={groupExpenses} activeTab={activeTab} />

        {/* Display all list of Activities */}
        <ActivityList activities={groupActivities} activeTab={activeTab} />

        {/* Display expense summary of the group */}
        <div>
          {activeTab === "summary" && (
            <ExpenseSummary expenses={groupSummary} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;
