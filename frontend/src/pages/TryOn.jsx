import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ShoppingBag, ChevronRight, Video, Scan, CheckCircle2, CloudUpload } from "lucide-react";
import { Link } from "react-router-dom";
import TryOnCanvas from "../components/try-on/TryOnCanvas";
import ImageUpload from "../components/try-on/ImageUpload";
import Controls from "../components/try-on/Controls";
import GlassesSelector, { GLASSES } from "../components/try-on/GlassesSelector";
import { useToast } from "../components/ui/Toast";
import { useAuth } from "../hooks/useAuth";
import { uploadTryOnPreview } from "../services/tryOnStorage";

const STEPS = [
  { num: 1, emoji: "1", label: "Upload Photo",  desc: "Front-facing selfie" },
  { num: 2, emoji: "2", label: "Choose Frame",  desc: "Pick any style" },
  { num: 3, emoji: "3", label: "Auto-Detect",   desc: "Face alignment" },
  { num: 4, emoji: "4", label: "Save & Shop",   desc: "Download preview" },
];

// Green palette
const G = {
  50:  "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
};

function StepBadge({ num, label, active, done }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        backgroundColor: done ? G[600] : active ? G[500] : "#e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: done || active ? "#fff" : "#94a3b8",
        fontSize: 12, fontWeight: 800,
        transition: "background 0.3s",
        boxShadow: done || active ? `0 0 0 3px ${G[200]}` : "none",
      }}>
        {done ? "+" : num}
      </div>
      <span style={{
        fontWeight: 700, fontSize: 14,
        color: active || done ? "#1a2e1a" : "#94a3b8",
      }}>
        {label}
      </span>
    </div>
  );
}

//  card style 
const card = {
  background: "#fff",
  border: `1px solid ${G[200]}`,
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 1px 6px rgba(34,197,94,0.07)",
};

//  main page component 
const TryOn = () => {
  const [userImage,       setUserImage]       = useState(null);
  const [webcamMode,      setWebcamMode]      = useState(false);
  const [selectedGlasses, setSelectedGlasses] = useState(GLASSES[0]);
  const [sizeScale,       setSizeScale]       = useState(1.0);
  const [rotation,        setRotation]        = useState(0);
  const [opacity,         setOpacity]         = useState(1);
  const [detectStatus,    setDetectStatus]    = useState("idle");
  const [downloading,     setDownloading]     = useState(false);
  const [uploading,       setUploading]       = useState(false);
  const canvasRef = useRef(null);
  const toast = useToast();
  const { user } = useAuth();

  const hasImage = !!(userImage || webcamMode);
  const step = !hasImage ? 1 : detectStatus === "found" ? 3 : 2;

  const handleWebcamToggle = (live) => {
    setWebcamMode(live);
    if (live) { setUserImage(null); setDetectStatus("idle"); }
  };

  const handleImageSelect = (url) => {
    setUserImage(url);
    setWebcamMode(false);
    setDetectStatus("idle");
  };

  const handleReset = () => {
    setSizeScale(1.0);
    setRotation(0);
    setOpacity(1);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = `tryon-${selectedGlasses.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloading(false);
    }, 120);
  };

  const handleUploadPreview = async () => {
    const canvas = canvasRef.current;
    if (!canvas || webcamMode) return;

    setUploading(true);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const result = await uploadTryOnPreview({
        dataUrl,
        frameId: selectedGlasses.id,
        userId: user?.id,
      });

      toast?.addToast(result.publicUrl ? "Preview uploaded to Supabase storage." : "Preview uploaded.", "success");
    } catch (error) {
      toast?.addToast(error.message || "Could not upload preview. Create a public 'tryon-previews' bucket in Supabase.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ backgroundColor: G[50], minHeight: "100vh", paddingBottom: 80 }}>

      {/*  HERO  */}
      <div style={{
        background: `linear-gradient(135deg, ${G[900]} 0%, ${G[800]} 45%, #0d3020 100%)`,
        padding: "64px 24px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* glow orb */}
        <div style={{
          position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 500, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${G[500]}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          {/* badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 18px", borderRadius: 99,
            background: `${G[500]}25`, border: `1px solid ${G[400]}60`,
            color: G[400], fontSize: 13, fontWeight: 700,
            letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: 20,
          }}>
            <Scan size={14} /> AI Virtual Try-On
          </span>

          {/* headline */}
          <h1 style={{
            fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#fff",
            lineHeight: 1.1, marginBottom: 16,
          }}>
            Try Glasses Before You Buy
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${G[400]}, #a3e635)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Face Detection Included
            </span>
          </h1>

          <p style={{ color: G[200], fontSize: 16, maxWidth: 460, margin: "0 auto 40px" }}>
            Upload a photo or go live on webcam. 68-point face landmarks auto-place
            glasses perfectly on your eyes.
          </p>

          {/* step icons */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24, maxWidth: 700, margin: "0 auto" }}>
            {STEPS.map((s) => (
              <div key={s.num} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 110 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, fontSize: 18, fontWeight: 900,
                  background: step >= s.num ? `${G[500]}30` : "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${step >= s.num ? `${G[400]}90` : "rgba(255,255,255,0.12)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: step >= s.num ? G[400] : "#475569",
                  transition: "all 0.3s",
                }}>
                  {s.num}
                </div>
                <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 12 }}>{s.label}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/*  WORKSPACE  */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 24px" }}>
        <div
          className="tryon-main-grid"
          style={{ display: "grid", gridTemplateColumns: "300px 1fr 280px", gap: 28, alignItems: "start" }}
        >

          {/*  LEFT COLUMN  */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* --- Upload card --- */}
            <div style={card}>
              <StepBadge num={1} label="Upload / Webcam" active={!hasImage} done={hasImage} />
              <div style={{ marginTop: 16 }}>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  image={userImage}
                  onWebcamToggle={handleWebcamToggle}
                  webcamMode={webcamMode}
                />
              </div>
              {userImage && !webcamMode && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => { setUserImage(null); setDetectStatus("idle"); }}
                  style={{
                    marginTop: 10, width: "100%", padding: 7,
                    border: `1px dashed ${G[300] ?? "#86efac"}`, borderRadius: 8,
                    background: "transparent", cursor: "pointer",
                    fontSize: 12, color: G[600], fontFamily: "inherit",
                  }}
                >
                  x  Remove photo
                </motion.button>
              )}
            </div>

            {/* --- Frame selector card --- */}
            <div style={card}>
              <StepBadge num={2} label="Choose Frame Style" active={hasImage} done={hasImage && step >= 2} />
              <div style={{ marginTop: 16 }}>
                <GlassesSelector selectedId={selectedGlasses.id} onSelect={setSelectedGlasses} />
              </div>
            </div>

            {/* --- Adjustments card --- */}
            <div style={card}>
              <StepBadge num={3} label="Fine-tune Fit" active={detectStatus === "found"} done={false} />
              <div style={{ marginTop: 16 }}>
                <Controls
                  sizeScale={sizeScale}   setSizeScale={setSizeScale}
                  rotation={rotation}     setRotation={setRotation}
                  opacity={opacity}       setOpacity={setOpacity}
                  onReset={handleReset}
                  detectStatus={detectStatus}
                  hasImage={hasImage}
                />
              </div>
            </div>
          </motion.div>

          {/*  CENTER COLUMN  */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
          >
            <div style={{ position: "sticky", top: 80 }}>
              {/* preview header */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 16, flexWrap: "wrap", gap: 10,
              }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#1a2e1a" }}>
                    Live Preview
                  </h3>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                    {webcamMode ? "Webcam active - face detection runs live" : "Drag on the canvas to fine-tune glasses placement"}
                  </p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={selectedGlasses.id}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{
                      padding: "5px 14px", borderRadius: 99,
                      backgroundColor: `${selectedGlasses.color}18`,
                      border: `1px solid ${selectedGlasses.color}55`,
                      color: selectedGlasses.color,
                      fontSize: 12, fontWeight: 700,
                    }}
                  >
                    {selectedGlasses.label}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* canvas */}
              <TryOnCanvas
                userImage={userImage}
                webcamMode={webcamMode}
                glassesImage={selectedGlasses.src}
                sizeScale={sizeScale}
                extraRotation={rotation}
                opacity={opacity}
                onDetectStatus={setDetectStatus}
                canvasRef={canvasRef}
              />

              {/* action buttons */}
              <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  disabled={!hasImage || downloading || webcamMode}
                  onClick={handleDownload}
                  style={{
                    flex: 1, padding: "13px 20px", borderRadius: 12, border: "none",
                    backgroundColor: hasImage && !webcamMode ? G[700] : "#cbd5e1",
                    color: "#fff", cursor: hasImage && !webcamMode ? "pointer" : "not-allowed",
                    fontWeight: 700, display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                    opacity: hasImage && !webcamMode ? 1 : 0.55,
                    fontFamily: "inherit", fontSize: 14,
                    transition: "background 0.2s, transform 0.1s",
                    minWidth: 160,
                  }}
                >
                  <Download size={16} />
                  {downloading ? "Saving..." : "Download Preview"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  disabled={!hasImage || uploading || webcamMode}
                  onClick={handleUploadPreview}
                  style={{
                    flex: 1, padding: "13px 20px", borderRadius: 12, border: `1px solid ${G[300]}`,
                    backgroundColor: hasImage && !webcamMode ? "#ffffff" : "#f1f5f9",
                    color: hasImage && !webcamMode ? G[700] : "#94a3b8",
                    cursor: hasImage && !webcamMode ? "pointer" : "not-allowed",
                    fontWeight: 700, display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                    opacity: hasImage && !webcamMode ? 1 : 0.55,
                    fontFamily: "inherit", fontSize: 14,
                    minWidth: 160,
                  }}
                >
                  <CloudUpload size={16} />
                  {uploading ? "Uploading..." : "Save to Supabase"}
                </motion.button>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ flex: 1, minWidth: 140 }}>
                  <Link
                    to={`/product/${selectedGlasses.productSlug}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "13px 20px", borderRadius: 12,
                      backgroundColor: G[600], color: "#fff",
                      fontWeight: 700, fontSize: 14, width: "100%",
                      boxSizing: "border-box", whiteSpace: "nowrap",
                    }}
                  >
                    <ShoppingBag size={16} /> Shop This Style
                  </Link>
                </motion.div>
              </div>

              {webcamMode && (
                <p style={{ marginTop: 10, fontSize: 12, color: G[600], textAlign: "center" }}>
                  Live webcam mode is for fitting only. Use Capture Selfie first if you want a downloadable still image.
                </p>
              )}

              {!webcamMode && (
                <p style={{ marginTop: 10, fontSize: 12, color: "#64748b", textAlign: "center" }}>
                  To upload previews, create a public Supabase storage bucket named tryon-previews.
                </p>
              )}

              {/* detect status banner */}
              {detectStatus === "found" && !webcamMode && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: 14, padding: "10px 16px", borderRadius: 10,
                    background: G[100], border: `1px solid ${G[400]}`, color: G[700],
                    fontSize: 13, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <CheckCircle2 size={15} /> Face detected - glasses aligned automatically to your eye line
                </motion.div>
              )}
            </div>
          </motion.div>

          {/*  RIGHT COLUMN  */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* selected frame card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGlasses.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  background: `linear-gradient(135deg, ${selectedGlasses.color}14, ${selectedGlasses.color}04)`,
                  border: `1.5px solid ${selectedGlasses.color}35`,
                  borderRadius: 16, padding: 20,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: selectedGlasses.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Selected Frame
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#1a2e1a", marginBottom: 4 }}>
                  {selectedGlasses.title}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                  {selectedGlasses.details}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: selectedGlasses.color, marginBottom: 12 }}>
                  {selectedGlasses.price}
                </div>
                <Link
                  to={`/shop?category=${selectedGlasses.categorySlug}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 14px", borderRadius: 10,
                    backgroundColor: selectedGlasses.color,
                    color: "#fff", fontWeight: 700, fontSize: 13,
                  }}
                >
                  Browse {selectedGlasses.label} Frames <ChevronRight size={15} />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* webcam live indicator */}
            {webcamMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{
                  borderRadius: 14, padding: 18,
                  background: `linear-gradient(135deg, ${G[900]}, ${G[800]})`,
                  border: `1px solid ${G[500]}44`,
                }}
              >
                <div style={{ color: G[400], fontWeight: 700, fontSize: 13, marginBottom: 8, display: "flex", gap: 7, alignItems: "center" }}>
                  <Video size={15} /> Live Webcam Active
                </div>
                <p style={{ color: G[200], fontSize: 12, lineHeight: 1.65, margin: 0 }}>
                  Face detection runs every 600ms. Glasses auto-align to your eyes. Drag on canvas to fine-tune.
                </p>
              </motion.div>
            )}

            {/* all frames nav */}
            <div style={card}>
              <h4 style={{ fontSize: 12, fontWeight: 800, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                All Frame Styles
              </h4>
              {GLASSES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGlasses(g)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: 10, borderRadius: 10, border: "none",
                    backgroundColor: selectedGlasses.id === g.id ? `${g.color}14` : "transparent",
                    cursor: "pointer", marginBottom: 4,
                    transition: "background 0.15s", textAlign: "left", fontFamily: "inherit",
                    outline: selectedGlasses.id === g.id ? `2px solid ${g.color}40` : "none",
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: g.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2e1a" }}>{g.label}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{g.desc}</div>
                  </div>
                  {selectedGlasses.id === g.id && (
                    <span style={{ marginLeft: "auto", fontSize: 11, color: g.color, fontWeight: 700 }}>Active</span>
                  )}
                </button>
              ))}
            </div>

            {/* tips card */}
            <div style={{ ...card, background: G[50], border: `1px solid ${G[200]}` }}>
              <h4 style={{ fontSize: 12, fontWeight: 800, marginBottom: 12, color: G[700], textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Tips for Best Results
              </h4>
              {[
                "Use a clear, front-facing selfie",
                "Even lighting improves face detection",
                "Drag the canvas to nudge glasses",
                "Use Size % if glasses look off-scale",
                "Capture Selfie tab lets you save live shots",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: G[500], fontWeight: 800, fontSize: 14, lineHeight: 1.4 }}>+</span>
                  <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1100px) {
          .tryon-main-grid { grid-template-columns: 280px 1fr !important; }
          .tryon-main-grid > div:last-child { grid-column: 1 / -1; }
        }
        @media (max-width: 700px) {
          .tryon-main-grid { grid-template-columns: 1fr !important; }
          .tryon-main-grid > div:last-child { grid-column: auto; }
        }
      `}</style>
    </div>
  );
};

export default TryOn;
