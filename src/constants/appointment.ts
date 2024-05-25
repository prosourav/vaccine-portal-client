export const tableDataRange = Object.freeze([10, 15, 20, 25]);

export const vaccineStatus = Object.freeze(['All', 'Pending', 'Complete']);
export const userStatus = Object.freeze(['All', 'Approved', 'Pending', 'Blocked']);

export const notSortableAppointmentItems = Object.freeze(["_id", "status", ]);
export const notSortableUserItems = Object.freeze(["id", "_id", "status", "vaccine"]);

export const defaultPagination = {
  limit: '15',
  page: 1,
  totalItems: '',
  totalPage: '',
  sort_type: '',
  sort_by: '',
  search: '',
  status: 'all',
};


// export const paginationState = {
//   limit: "15",
//   page: 1,
//   totalItems: "",
//   totalPage: "",
//   sort_type: "",
//   sort_by: "",
//   search: "",
//   status: "all"
// }