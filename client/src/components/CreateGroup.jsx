import React, { useContext, useState } from "react";
import { GroupContext } from "../context/GroupContext";
import { FriendContext } from "../context/FriendContext";
import { ActivityContext } from "../context/ActivityContext";

const CreateGroup = ({ toggleModal }) => {
  const [groupName, setGroupName] = useState("");
  const { addGroup } = useContext(GroupContext);
  const { addActivity } = useContext(ActivityContext);
  const [groupMembers, setGroupMembers] = useState(["Deepjoy"]);
  const [showMembersAccordion, setShowMembersAccordion] = useState(false);
  const { friends } = useContext(FriendContext);

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const generateGroupId = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const formattedGroupName = groupName.toLowerCase().replace(/\s+/g, "-");
    const groupId = `${formattedGroupName}-${randomString}`;
    return groupId;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const groupId = generateGroupId();
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    const groupDetails = {
      name: groupName,
      groupMembers: groupMembers,
      date: date,
      time: time,
      groupId: groupId,
    };
    console.log("Group Details : ", groupDetails);
    addGroup(groupDetails);
    toggleModal();

    const activityDetails = {
      groupId: groupId,
      activityMessage: `Group created on ${date} at ${time} with members: ${groupMembers.join(
        ", "
      )}`,
    };
    console.log("Activity Details : ", activityDetails);
    addActivity(activityDetails);

    setGroupName("");
    setGroupMembers([]);
  };

  const toggleMembersAccordion = () => {
    setShowMembersAccordion(!showMembersAccordion);
  };

  const handleCheckboxChange = (memberName) => {
    if (groupMembers.includes(memberName)) {
      setGroupMembers(groupMembers.filter((name) => name !== memberName));
    } else {
      setGroupMembers([...groupMembers, memberName]);
    }
  };

  return (
    <>
      <div className="create-group-container">
        <h2>Create a new group</h2>
        <form>
          <div className="form-group">
            <label htmlFor="group-name">Group Name:</label>
            <input
              type="text"
              name="group-name"
              placeholder="Enter group name"
              value={groupName}
              onChange={handleGroupNameChange}
              required
            ></input>
          </div>

          {/* Add Members to Group */}
          <div>
            <button type="button" onClick={toggleMembersAccordion}>
              Add Members
            </button>
            {showMembersAccordion && (
              <div className="add-members-container">
                <div className="checkbox-container">
                  {friends.map((member, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        id={`member-${index}`}
                        value={member.name}
                        checked={groupMembers.includes(member.name)}
                        onChange={() => handleCheckboxChange(member.name)}
                      />
                      <label
                        className="add-members-label"
                        htmlFor={`member-${index}`}
                      >
                        {member.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={handleSubmit}>Create Group</button>
          <button onClick={toggleModal}>Cancel</button>
        </form>
      </div>
    </>
  );
};

export default CreateGroup;
