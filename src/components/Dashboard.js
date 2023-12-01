import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { LinearProgress } from "@mui/material";
import axios from 'axios';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const handleSelection = (event) => {
    setSelectionModel(event);
  };

  const handleDelete = () => {
    const selectedIDs = new Set(selectionModel);
    setCandidates((r) => r.filter((x) => !selectedIDs.has(x.id)));
  };

  useEffect(() => {
      axios({
        url: `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`,
        method: "GET",
      })
        .then((res) => {
          console.log(res.data);
          setCandidates(res.data);
        })
        .catch((err) => {});
  }, []);

  const columns = [
    { field: "id", headerName: "ID", minWidth: 250, editable:true },
    { field: "name", headerName: "Name", minWidth: 350, editable:true },
    { field: "email", headerName: "Email ID", minWidth: 250, editable:true },
    {
      field: "role",
      headerName: "Role",
      renderCell: (params) => (
        <div
          style={{
            color:
              params.value === "member"
                ? "#008e0e"
                : params.value === "admin"
                ? "#ba1b1b"
                : "#ffa500",
            fontWeight: 500,
          }}
        >
          {params.value}
        </div>
      ), editable:true
    },
  ];

  const rows =
    candidates && candidates.length > 0
      ? candidates.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
        }))
      : [];

  return (<>
    <div className="tablecontainer" style={{width:"70%", marginLeft:"15%", marginTop:"1rem"}}>
      {selectionModel.length > 0 && (
        <div>
          <button className="delete" onClick={handleDelete} style={{width:"5rem", cursor: "pointer", height:"2rem", backgroundColor:"red", color:"white", borderRadius:"20px", marginLeft:"90%", marginBottom:"0.5rem"}}>Delete</button>
        </div>
      )}
      <DataGrid
        sx={{ cursor: "pointer" }}
        autoHeight={true}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        
        checkboxSelection
        slots={{
          toolbar: GridToolbar,
          loadingOverlay: LinearProgress,
        }}
        onRowSelectionModelChange={handleSelection}
        selectionModel={selectionModel}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </div>
    </>
  );
};

export default Dashboard;
