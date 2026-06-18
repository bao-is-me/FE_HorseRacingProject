import React, { useEffect, useMemo, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { demoAccounts } from "../../../mocks/accounts.mock";
import { HORSE_STATUS_VALUES } from "../../../domain";

const EMPTY_FORM = {
  ownerId: "",
  horseName: "",
  age: "",
  breed: "",
  weight: "",
  status: "Healthy",
  recordWins: "0",
  color: "",
  imageUrl: "",
  image: null
};

function validateHorse(values, isAdmin, mode) {
  const errors = {};
  if (!values.horseName.trim()) errors.horseName = "Horse name is required.";
  if (values.horseName.length > 100) errors.horseName = "Maximum 100 characters.";
  if (values.age !== "" && (Number(values.age) < 0 || Number(values.age) > 100)) errors.age = "Age must be between 0 and 100.";
  if (values.breed.length > 50) errors.breed = "Maximum 50 characters.";
  if (values.weight !== "" && (Number(values.weight) < 0 || Number(values.weight) > 2000)) errors.weight = "Weight must be between 0 and 2000.";
  if (values.color.length > 20) errors.color = "Maximum 20 characters.";
  if (Number(values.recordWins) < 0) errors.recordWins = "Record wins cannot be negative.";
  if (isAdmin && mode === "create" && !values.ownerId) errors.ownerId = "Owner is required when Admin creates a horse.";
  return errors;
}

function HorseFormModal({ open, mode = "create", horse, ownerOnly, user, onClose, onSubmit }) {
  const isEdit = mode === "edit";
  const isAdmin = !ownerOnly;
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const owners = useMemo(() => demoAccounts.filter((account) => account.role === "HorseOwner"), []);

  useEffect(() => {
    if (!open) return;
    const next = horse
      ? {
          ...EMPTY_FORM,
          ownerId: horse.ownerId || "",
          horseName: horse.name || "",
          age: horse.age ?? "",
          breed: horse.breed || "",
          weight: horse.weight ?? "",
          status: horse.status || "Healthy",
          recordWins: horse.recordWins ?? 0,
          color: horse.color || "",
          imageUrl: horse.imageUrl || ""
        }
      : { ...EMPTY_FORM, ownerId: ownerOnly ? user?.id || "" : "" };
    setValues(next);
    setPreviewUrl(next.imageUrl || "");
    setErrors({});
  }, [open, horse, ownerOnly, user]);

  useEffect(() => () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  if (!open) return null;

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setValues((current) => ({ ...current, image: file, imageUrl: "" }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateHorse(values, isAdmin, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSubmit({
      ...values,
      age: values.age === "" ? null : Number(values.age),
      weight: values.weight === "" ? null : Number(values.weight),
      recordWins: values.recordWins === "" ? 0 : Number(values.recordWins),
      imageUrl: previewUrl || values.imageUrl || null
    });
  };

  return (
    <div className="horse-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="horse-modal" role="dialog" aria-modal="true" aria-labelledby="horse-form-title">
        <header className="horse-modal-header">
          <div>
            <span>{isEdit ? "Update horse" : "New stable record"}</span>
            <h2 id="horse-form-title">{isEdit ? `Edit ${horse?.name}` : "Add a horse"}</h2>
            <p>{isEdit ? "Only fields supported by HorseUpdateRequest are editable." : "Complete the HorseCreateRequest information below."}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close horse form"><X size={20} /></button>
        </header>

        <form className="horse-form-layout" onSubmit={submit}>
          <aside className="horse-upload-panel">
            <div className={`horse-upload-preview ${previewUrl ? "has-image" : ""}`}>
              {previewUrl ? <img src={previewUrl} alt="Horse preview" /> : <ImagePlus size={42} />}
            </div>
            {!isEdit && (
              <>
                <label className="secondary-button horse-upload-button">
                  <Upload size={17} />
                  {previewUrl ? "Replace image" : "Upload image"}
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectImage} />
                </label>
                {previewUrl && <button className="text-button" type="button" onClick={() => { setPreviewUrl(""); setValues((current) => ({ ...current, image: null, imageUrl: "" })); }}>Remove image</button>}
                <small>PNG, JPG or WEBP. The create request is sent as multipart form data.</small>
              </>
            )}
            {isEdit && <small>Image replacement is disabled because HorseUpdateRequest does not contain Image or ImageUrl.</small>}
          </aside>

          <div className="horse-form-fields">
            {!isEdit && isAdmin && (
              <label className="field span-all">
                <span>Owner *</span>
                <select value={values.ownerId} onChange={update("ownerId")}>
                  <option value="">Select a Horse Owner</option>
                  {owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.fullName} — {owner.email}</option>)}
                </select>
                {errors.ownerId && <em>{errors.ownerId}</em>}
              </label>
            )}
            <label className="field span-all">
              <span>Horse Name *</span>
              <input value={values.horseName} onChange={update("horseName")} maxLength={100} placeholder="e.g. Silver Comet" />
              {errors.horseName && <em>{errors.horseName}</em>}
            </label>
            <label className="field">
              <span>Age</span>
              <input type="number" min="0" max="100" value={values.age} onChange={update("age")} placeholder="4" />
              {errors.age && <em>{errors.age}</em>}
            </label>
            <label className="field">
              <span>Breed</span>
              <input value={values.breed} onChange={update("breed")} maxLength={50} placeholder="Thoroughbred" />
              {errors.breed && <em>{errors.breed}</em>}
            </label>
            <label className="field">
              <span>Weight (kg)</span>
              <input type="number" min="0" max="2000" step="0.1" value={values.weight} onChange={update("weight")} placeholder="482" />
              {errors.weight && <em>{errors.weight}</em>}
            </label>
            <label className="field">
              <span>Color</span>
              <input value={values.color} onChange={update("color")} maxLength={20} placeholder="Gray" />
              {errors.color && <em>{errors.color}</em>}
            </label>
            <label className="field">
              <span>Record Wins</span>
              <input type="number" min="0" value={values.recordWins} onChange={update("recordWins")} />
              {errors.recordWins && <em>{errors.recordWins}</em>}
            </label>
            <label className="field">
              <span>Health Status</span>
              <select value={values.status} onChange={update("status")}>
                {HORSE_STATUS_VALUES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
          </div>

          <footer className="horse-modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit">{isEdit ? "Save changes" : "Add horse"}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default HorseFormModal;
