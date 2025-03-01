import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
  FormControlLabel,
  Checkbox,
  Avatar,
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import { EmployeeFormData } from "./types";
import axios from "axios";
import {
  fetchTypeEntries,
  fetchShiftEntries,
  fetchStatusEntries,
} from "../../api/establishmentService";
import { SelectChangeEvent } from "@mui/material/Select";
import { masterService } from "../../api/masterService";
import { instituteService } from "../../api/instituteService";
import { employeeService } from "../../api/MasterEmployeeService";

const CreateEmployee = () => {
  const initialFormState: EmployeeFormData = {
    institute: "",
    department: "", // Change back to empty string
    shortCode: "",
    empType: "",
    empName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: null,
    designation: "",
    permanentAddress: "",
    email: "",
    localAddress: "",
    panNo: "",
    permanentCity: "",
    permanentPinNo: "",
    drivingLicNo: "",
    sex: "",
    status: "",
    maritalStatus: "",
    dateOfJoin: null,
    localCity: "",
    localPinNo: "",
    position: "",
    shift: "",
    bloodGroup: "",
    active: "yes",
    phoneNo: "",
    mobileNo: "",
    category: "", // Change back to empty string
    bankAccountNo: "",
    unaNo: "",
    profileImage: null,
  };

  const [formData, setFormData] = useState<EmployeeFormData>(initialFormState);

  const [institutes, setInstitutes] = useState([
    { id: "1", name: "Institute 1" },
    { id: "2", name: "Institute 2" },
  ]);

  const [sameAsPermAddress, setSameAsPermAddress] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [employeeTypes, setEmployeeTypes] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await instituteService.getInstitutes();
        console.log("Institutes:", response.data);
        setInstitutes(response.data);
      } catch (error) {
        console.error("Error fetching institutes:", error);
      }
    };
    fetchInstitutes();
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [typeRes, shiftRes, statusRes] = await Promise.all([
          fetchTypeEntries(),
          fetchShiftEntries(),
          fetchStatusEntries(),
        ]);

        // Log the raw responses to see their structure
        console.log("Raw Type Data:", typeRes.data);
        console.log("Raw Shift Data:", shiftRes.data);
        console.log("Raw Status Data:", statusRes.data);

        // Set the state without filtering
        setEmployeeTypes(typeRes.data || []);
        setShifts(shiftRes.data || []);
        setStatuses(statusRes.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [deptRes, desigRes] = await Promise.all([
          masterService.getDepartments(),
          masterService.getDesignations(),
        ]);
        console.log("Departments:", deptRes.data);
        console.log("Designations:", desigRes.data);
        setDepartments(deptRes.data);
        setDesignations(desigRes.data);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await masterService.getCategories();
        console.log("Categories:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Debug helper
  useEffect(() => {
    console.log("Employee Types:", employeeTypes);
    console.log("Shifts:", shifts);
    console.log("Statuses:", statuses);
  }, [employeeTypes, shifts, statuses]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Input changed - name: ${name}, value: ${value}`); // Debug log
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new handler for Select components
  const handleSelectChange = (e: SelectChangeEvent) => {
    console.log("Select Change:", e.target.name, e.target.value);
    setFormData((prev) => {
      const newState = {
        ...prev,
        [e.target.name]: e.target.value,
      };
      console.log("New Form Data:", newState);
      return newState;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        profileImage: file,
      });
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  // Cleanup preview URL on component unmount
  React.useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleDateChange =
    (field: "dateOfBirth" | "dateOfJoin") => (date: Date | null) => {
      setFormData({
        ...formData,
        [field]: date,
      });
    };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (sameAsPermAddress && name.startsWith("permanent")) {
        const localField = name.replace("permanent", "local");
        return {
          ...prev,
          [name]: value,
          [localField]: value,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSameAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setSameAsPermAddress(isChecked);

    if (isChecked) {
      // When checkbox is checked, copy all permanent address fields to local
      setFormData((prev) => ({
        ...prev,
        localAddress: prev.permanentAddress,
        localCity: prev.permanentCity,
        localPinNo: prev.permanentPinNo,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();

      // Convert string IDs to numbers before sending
      const requiredFields = {
        EMP_NAME: formData.empName,
        EMAIL: formData.email,
        DESIGNATION: formData.designation,
        DEPARTMENT: Number(formData.department), // Convert to number
        INSTITUTE: formData.institute,
        DATE_OF_JOIN: formData.dateOfJoin
          ? new Date(formData.dateOfJoin).toISOString().split("T")[0]
          : "",
        MOBILE_NO: formData.mobileNo,
        SEX: formData.sex,
        CATEGORY: Number(formData.category), // Convert to number
      };

      // Log what we're sending
      console.log("Form Data Values:", {
        department: formData.department, // This will now be the CODE
        category: formData.category, // This will now be the CODE
        position: formData.position,
      });

      // Validate required fields
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        setNotification({
          open: true,
          message: `Please fill in required fields: ${missingFields.join(
            ", "
          )}`,
          severity: "error",
        });
        return;
      }

      // Add required fields
      Object.entries(requiredFields).forEach(([key, value]) => {
        formDataObj.append(key, String(value));
      });

      // Add optional fields (only if they have values)
      const optionalFields = {
        SHORT_CODE: formData.shortCode || "",
        FATHER_NAME: formData.fatherName || "",
        MOTHER_NAME: formData.motherName || "",
        DATE_OF_BIRTH: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
          : "",
        PERMANENT_ADDRESS: formData.permanentAddress || "",
        LOCAL_ADDRESS: formData.localAddress || "",
        PAN_NO: formData.panNo || "",
        PERMANENT_CITY: formData.permanentCity || "",
        PERMANENT_PIN: formData.permanentPinNo || "",
        DRIVING_LICENSE_NO: formData.drivingLicNo || "",
        STATUS: formData.status || "",
        MARITAL_STATUS: formData.maritalStatus || "",
        LOCAL_CITY: formData.localCity || "",
        LOCAL_PIN: formData.localPinNo || "",
        SHIFT: formData.shift || "",
        BLOOD_GROUP: formData.bloodGroup || "",
        IS_ACTIVE: formData.active || "yes",
        PHONE_NO: formData.phoneNo || "",
        BANK_ACCOUNT_NO: formData.bankAccountNo || "",
        UAN_NO: formData.unaNo || "",
      };

      // Add optional fields
      Object.entries(optionalFields).forEach(([key, value]) => {
        if (value) formDataObj.append(key, String(value));
      });

      // Add profile image if exists
      if (formData.profileImage) {
        formDataObj.append("PROFILE_IMAGE", formData.profileImage);
      }

      // Log data being sent
      console.log("Sending data:", Object.fromEntries(formDataObj));

      const response = await employeeService.createEmployee(formDataObj);

      if (response.data) {
        setNotification({
          open: true,
          message: `Employee created successfully! Employee ID: ${response.data.employee_id}`,
          severity: "success",
        });
        setFormData(initialFormState);
        setPhotoPreview(null);
      }
    } catch (error: any) {
      console.error("Submit Error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to create employee";
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Add this helper function at the top of the component
  const RequiredLabel = ({ label }: { label: string }) => (
    <span>
      {label} <span style={{ color: "#d32f2f" }}>*</span>
    </span>
  );

  // Add a new helper function for single star labels
  const SingleStarLabel = ({ label }: { label: string }) => (
    <span>
      {label} <span style={{ color: "#d32f2f" }}>*</span>
    </span>
  );

  return (
    <Paper elevation={3} sx={{ p: 0.5, m: 0.25, maxHeight: "98vh" }}>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={0.5}>
          {/* Header with Photo */}
          <Grid item xs={12} sx={{ mb: 0.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Employee Details
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  src={photoPreview || undefined}
                  sx={{
                    width: 100,
                    height: 100,
                    border: "2px solid #e0e0e0",
                    boxShadow: 1,
                    borderRadius: "8px", // Making it slightly square
                  }}
                />
                <Button variant="outlined" component="label" size="small">
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </Button>
              </Stack>
            </Stack>
          </Grid>

          {/* Row 1 - Basic Info */}
          <Grid item xs={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{<SingleStarLabel label="Institute" />}</InputLabel>
              <Select
                value={formData.institute}
                name="institute"
                onChange={handleSelectChange}
                error={!formData.institute}
                label={<SingleStarLabel label="Institute" />}
              >
                {institutes.map((inst: any) => (
                  <MenuItem key={inst.INSTITUTE_ID} value={inst.CODE}>
                    {inst.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{<SingleStarLabel label="Department" />}</InputLabel>
              <Select
                value={formData.department}
                name="department"
                onChange={handleSelectChange}
                error={!formData.department}
                label={<SingleStarLabel label="Department" />}
              >
                {departments?.map((dept: any) => (
                  <MenuItem key={dept.DEPARTMENT_ID} value={dept.DEPARTMENT_ID}>
                    {dept.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <TextField
              size="small"
              fullWidth
              label="Short Code"
              name="shortCode"
            />
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Emp Type</InputLabel>
              <Select
                value={formData.empType}
                name="empType"
                onChange={handleSelectChange}
                label="Emp Type"
              >
                {employeeTypes?.map((type: any) => (
                  <MenuItem key={type.ID} value={type.ID}>
                    {type.RECORD_WORD}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <TextField
              size="small"
              fullWidth
              label="Position"
              name="position"
            />
          </Grid>

          {/* Row 2 - Personal Info */}
          <Grid item xs={2.4}>
            <TextField
              size="small"
              fullWidth
              value={formData.empName}
              onChange={handleInputChange}
              label={<SingleStarLabel label="Employee Name" />} // Changed from RequiredLabel
              name="empName" // This maps to the formData field
              error={!formData.empName}
              helperText={!formData.empName ? "Employee Name is required" : ""}
            />
          </Grid>
          <Grid item xs={2.4}>
            <TextField
              size="small"
              fullWidth
              label="Father Name"
              name="fatherName"
            />
          </Grid>
          <Grid item xs={2.4}>
            <TextField
              size="small"
              fullWidth
              label="Mother Name"
              name="motherName"
            />
          </Grid>
          <Grid item xs={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>{<SingleStarLabel label="Designation" />}</InputLabel>
              <Select
                value={formData.designation}
                name="designation"
                onChange={handleSelectChange}
                error={!formData.designation}
                label={<SingleStarLabel label="Designation" />}
              >
                {designations?.map((desig: any) => (
                  <MenuItem
                    key={desig.DESIGNATION_ID}
                    value={desig.DESIGNATION_ID}
                  >
                    {desig.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Shift</InputLabel>
              <Select
                value={formData.shift}
                name="shift"
                onChange={handleSelectChange}
                label="Shift"
              >
                {shifts?.map((shift: any) => (
                  <MenuItem key={shift.ID} value={shift.ID}>
                    {shift.SHIFT_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Row 3 - Contact & Dates */}
          <Grid item xs={2.4}>
            <TextField
              size="small"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              label={<SingleStarLabel label="Email" />} // Changed from RequiredLabel
              name="email" // This maps to the formData field
              type="email"
              error={!formData.email}
              helperText={!formData.email ? "Email is required" : ""}
            />
          </Grid>
          <Grid item xs={2.4}>
            <TextField size="small" fullWidth label="Phone" name="phoneNo" />
          </Grid>
          <Grid item xs={2.4}>
            <TextField
              size="small"
              fullWidth
              value={formData.mobileNo} // This maps to the formData field
              onChange={handleInputChange}
              label={<SingleStarLabel label="Mobile No" />} // Changed from RequiredLabel
              name="mobileNo"
              error={!formData.mobileNo}
              helperText={!formData.mobileNo ? "Mobile No is required" : ""}
            />
          </Grid>
          <Grid item xs={2.4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Birth Date"
                value={formData.dateOfBirth}
                onChange={handleDateChange("dateOfBirth")}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={2.4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Join Date"
                value={formData.dateOfJoin}
                onChange={handleDateChange("dateOfJoin")}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Addresses */}
          <Grid item xs={12} sx={{ mt: 0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sameAsPermAddress}
                  onChange={handleSameAddressChange}
                  size="small"
                />
              }
              label={<Typography variant="caption">Same Address</Typography>}
            />
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={0.5}>
              <TextField
                size="small"
                fullWidth
                multiline
                rows={1}
                label="Permanent Address"
                name="permanentAddress"
                onChange={handleAddressChange}
              />
              <Stack direction="row" spacing={0.5}>
                <TextField
                  size="small"
                  fullWidth
                  label="City"
                  name="permanentCity"
                  onChange={handleAddressChange}
                />
                <TextField
                  size="small"
                  fullWidth
                  label="PIN"
                  name="permanentPinNo"
                  onChange={handleAddressChange}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={0.5}>
              <TextField
                size="small"
                fullWidth
                multiline
                rows={1}
                label="Local Address"
                name="localAddress"
                value={formData.localAddress}
                onChange={handleInputChange}
                disabled={sameAsPermAddress}
              />
              <Stack direction="row" spacing={0.5}>
                <TextField
                  size="small"
                  fullWidth
                  label="City"
                  name="localCity"
                  value={formData.localCity}
                  onChange={handleInputChange}
                  disabled={sameAsPermAddress}
                />
                <TextField
                  size="small"
                  fullWidth
                  label="PIN"
                  name="localPinNo"
                  value={formData.localPinNo}
                  onChange={handleInputChange}
                  disabled={sameAsPermAddress}
                />
              </Stack>
            </Stack>
          </Grid>

          {/* Row 5 - Additional Details */}
          <Grid item xs={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{<SingleStarLabel label="Sex" />}</InputLabel>
              <Select
                value={formData.sex}
                name="sex"
                onChange={handleSelectChange}
                error={!formData.sex}
                label={<SingleStarLabel label="Sex" />}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Blood Group</InputLabel>
              <Select
                value={formData.bloodGroup}
                name="bloodGroup"
                onChange={handleSelectChange}
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Marital Status</InputLabel>
              <Select
                value={formData.maritalStatus}
                name="maritalStatus"
                onChange={handleSelectChange}
              >
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="married">Married</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                name="status"
                onChange={handleSelectChange}
                label="Status"
              >
                {statuses?.map((status: any) => (
                  <MenuItem key={status.ID} value={status.ID}>
                    {status.RECORD_WORD}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{<SingleStarLabel label="Category" />}</InputLabel>
              <Select
                value={formData.category}
                name="category"
                onChange={handleSelectChange}
                error={!formData.category}
                label={<SingleStarLabel label="Category" />}
              >
                {categories?.map((category: any) => (
                  <MenuItem
                    key={category.CATEGORY_ID}
                    value={category.CATEGORY_ID}
                  >
                    {category.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Active</InputLabel>
              <Select
                value={formData.active}
                name="active"
                onChange={handleSelectChange}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Row 6 - IDs and Numbers */}
          <Grid item xs={2}>
            <TextField size="small" fullWidth label="PAN No" name="panNo" />
          </Grid>
          <Grid item xs={2}>
            <TextField size="small" fullWidth label="UAN No" name="unaNo" />
          </Grid>
          <Grid item xs={2}>
            <TextField
              size="small"
              fullWidth
              label="Bank A/C No"
              name="bankAccountNo"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              size="small"
              fullWidth
              label="Driving Lic No"
              name="drivingLicNo"
            />
          </Grid>

          {/* Submit Button */}
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              type="submit"
              variant="contained"
              size="small"
              sx={{ mt: 0.5 }}
            >
              Save Employee Details
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreateEmployee;
