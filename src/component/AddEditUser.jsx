import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { addFirms, getAllFirms, getAllSubscriptions, updateFirm } from "../redux/slices/adminSlice";

const AddEditUser = ({ editData }) => {
  const dispatch = useDispatch();

  const { subscriptions } = useSelector((state) => state.admin);

  const [loading, setLoading] = useState(false);
  const [subscriptionOptions, setSubscriptionOptions] = useState([]);

  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    if (subscriptions?.length) setSubscriptionOptions(subscriptions);
  }, [subscriptions]);

  const formik = useFormik({
    initialValues: {
      name: editData?.name || "",
      email: editData?.email || "",
      phone: editData?.phone || "",
      subscription_type: editData?.subscription_type || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      subscription_type: Yup.string().required("Subscription type is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        if (editData) {
          await dispatch(updateFirm({ id: editData.id, ...values }));
        } else {
          await dispatch(addFirms(values));
        }

        await dispatch(getAllFirms());
        resetForm();

        const modal = document.getElementById("create-newuser-popup");
        if (modal) {
          const bootstrapModal = bootstrap.Modal.getInstance(modal);
          bootstrapModal?.hide();
        }
      } catch (error) {
        console.error("Error submitting:", error);
      } finally {
        setLoading(false);
      }
    },
    enableReinitialize: true,
  });

  return (
    <div
      className="modal fade"
      id="create-newuser-popup"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div className="modal-dialog big-modal-common" role="document">
        <div className="modal-content clearfix">
          <div className="modal-heading">
            <button
              type="button"
              className="close close-btn-front"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img src="images/menu-icons/close-popup-icon.svg" alt="" />
            </button>
          </div>

          <div className="modal-body">
            <div className="common-form-wrap">
              <form onSubmit={formik.handleSubmit}>
                <div className="common-pop-warp">
                  <h3>{editData ? "Edit" : "Add"}</h3>
                  <div className="creat-new-user-wrap">
                    <div className="col-lg-12">
                      <div className="row">

                        <div className="col-lg-6">
                          <label>
                            <h3>Name</h3>
                            <input
                              type="text"
                              name="name"
                              placeholder="Enter name"
                              value={formik.values.name}
                              onChange={formik.handleChange}
                            />
                            {formik.touched.name && formik.errors.name && (
                              <div className="text-danger">{formik.errors.name}</div>
                            )}
                          </label>
                        </div>

                        <div className="col-lg-6">
                          <label>
                            <h3>Email</h3>
                            <input
                              type="text"
                              name="email"
                              placeholder="Enter Email"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                            />
                            {formik.touched.email && formik.errors.email && (
                              <div className="text-danger">{formik.errors.email}</div>
                            )}
                          </label>
                        </div>

                        <div className="col-lg-6">
                          <label>
                            <h3>Phone</h3>
                            <input
                              type="text"
                              name="phone"
                              placeholder="Enter Phone"
                              value={formik.values.phone}
                              onChange={formik.handleChange}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                              <div className="text-danger">{formik.errors.phone}</div>
                            )}
                          </label>
                        </div>

                        <div className="col-lg-6">
                          <label>
                            <h3>Subscription Type</h3>
                            <select
                              name="subscription_type"
                              value={formik.values.subscription_type}
                              onChange={formik.handleChange}
                            >
                              <option value="">Select Subscription</option>
                              {subscriptionOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                            {formik.touched.subscription_type && formik.errors.subscription_type && (
                              <div className="text-danger">{formik.errors.subscription_type}</div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="big-modal-common-btns">
                      <button
                        type="submit"
                        style={{
                          borderRadius: "30px",
                          color: "#fff",
                          textAlign: "center",
                          padding: "10px 43px",
                          backgroundColor: "#000429",
                          fontSize: "15px",
                          width: "auto",
                          fontWeight: 400,
                        }}
                        className="big-modal-common-btns"
                      >
                        {loading ? "Saving..." : editData ? "Update" : "Save"}
                      </button>
                    </div>

                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditUser;