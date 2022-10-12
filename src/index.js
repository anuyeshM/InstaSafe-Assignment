import React from "react";
import ReactDOM from "react-dom";
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm
} from "react-crud-table";

// Component's Base CSS
import "./index.css";

const AddressRenderer = ({ field }) => <textarea {...field} />;

let tasks = [];

const SORTERS = {
  NUMBER_ASCENDING: (mapper) => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: (mapper) => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: (mapper) => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: (mapper) => (a, b) => mapper(b).localeCompare(mapper(a))
};

const getSorter = (data) => {
  const mapper = (x) => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

  if (data.field === "id") {
    sorter =
      data.direction === "ascending"
        ? SORTERS.NUMBER_ASCENDING(mapper)
        : SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter =
      data.direction === "ascending"
        ? SORTERS.STRING_ASCENDING(mapper)
        : SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};

let count = tasks.length;
const service = {
  fetchItems: (payload) => {
    let result = Array.from(tasks);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result);
  },
  create: (task) => {
    count += 1;
    tasks.push({
      ...task,
      id: count
    });
    return Promise.resolve(task);
  },
  update: (data) => {
    const task = tasks.find((t) => t.id === data.id);
    task.title = data.title;
    task.description = data.description;
    return Promise.resolve(task);
  },
  delete: (data) => {
    const task = tasks.find((t) => t.id === data.id);
    tasks = tasks.filter((t) => t.id !== task.id);
    return Promise.resolve(task);
  }
};

const styles = {
  container: { margin: "auto", width: "fit-content" }
};

const Example = () => (
  <div style={styles.container}>
    <CRUDTable
      caption="Tasks"
      fetchItems={(payload) => service.fetchItems(payload)}
    >
      <Fields>
        <Field name="Name" label="Name" placeholder="Please enter your name" />
        <Field
          name="Email"
          label="Email Id"
          placeholder="Please enter your Email Id"
        />
        <Field
          name="Address"
          label="Please enter your address"
          render={AddressRenderer}
        />
        <Field
          name="MobileNumber"
          label="MobileNumber"
          placeholder="Please enter your Mobile Number"
        />
      </Fields>
     
      <CreateForm
        title="User Creation"
        message="Create a new user!"
        trigger="Create User"
        onSubmit={(user) => service.create(user)}
        submitText="Create"
        validate={(values) => {
          const errors = {};
          if (!values.Name) {
            errors.title = "Please, provide name";
          }
          if (!values.MobileNumber) {
            errors.title = "Please, provide mobile number";
          }
          if (!values.Email) {
            errors.title = "Please, provide email";
          }

          if (!values.Address) {
            errors.description = "Please, provide Address";
          }

          return errors;
        }}
      />
   

      <UpdateForm
        title="Task Update Process"
        message="Update task"
        trigger="Update"
        onSubmit={(task) => service.update(task)}
        submitText="Update"
        validate={(values) => {
          const errors = {};

          if (!values.Name) {
            errors.title = "Please, provide name";
          }
          if (!values.MobileNumber) {
            errors.title = "Please, provide mobile number";
          }
          if (!values.Email) {
            errors.title = "Please, provide email";
          }

          if (!values.Address) {
            errors.description = "Please, provide Address";
          }

          return errors;
        }}
      />

      <DeleteForm
        title="Task Delete Process"
        message="Are you sure you want to delete the task?"
        trigger="Delete"
        onSubmit={(task) => service.delete(task)}
        submitText="Delete"
        validate={(values) => {
          const errors = {};
          if (!values.id) {
            errors.id = "Please, provide id";
          }
          return errors;
        }}
      />
    </CRUDTable>
  </div>
);

Example.propTypes = {};

ReactDOM.render(<Example />, document.getElementById("root"));
