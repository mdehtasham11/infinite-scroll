import React, { useState, useRef } from "react";
import {
  FaUpload,
  FaDownload,
  FaEdit,
  FaMagic,
  FaUndo,
  FaRedo,
  FaPalette,
  FaCrop,
  FaAdjust,
  FaEraser,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// Black Forest Labs Flux API configuration
const BFL_API_KEY =
  import.meta.env.VITE_BFL_API_KEY || "27531828-168c-4480-a2b8-d5460272a4a3";
const BFL_BASE_URL = "https://api.bfl.ai/v1";

function ImageEditor() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editHistory, setEditHistory] = useState([]);
  const [currentEditIndex, setCurrentEditIndex] = useState(-1);
  const [selectedModel, setSelectedModel] = useState("flux-kontext-pro");
  const fileInputRef = useRef(null);

  // Utility function to convert image to base64
  const imageToBase64 = (imageUrl) => {
    return new Promise((resolve, reject) => {
      if (imageUrl.startsWith("data:")) {
        // Already a data URL, extract base64 part
        const base64 = imageUrl.split(",")[1];
        resolve(base64);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        try {
          const dataURL = canvas.toDataURL("image/jpeg", 0.9);
          const base64 = dataURL.split(",")[1];
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  // Function to make Flux API request
  const makeFluxRequest = async (prompt, inputImage) => {
    const response = await fetch(`${BFL_BASE_URL}/${selectedModel}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-key": BFL_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        input_image: inputImage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Flux API request failed: ${response.status} ${response.statusText}. ${
          errorData.message || ""
        }`
      );
    }

    return await response.json();
  };

  // Function to poll for result
  const pollForResult = async (pollingUrl) => {
    const maxAttempts = 60; // 30 seconds with 0.5s intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch(pollingUrl, {
        headers: {
          accept: "application/json",
          "x-key": BFL_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Polling failed: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log(`Status: ${result.status}`);

      if (result.status === "Ready") {
        return result.result.sample;
      } else if (result.status === "Error" || result.status === "Failed") {
        throw new Error(`Generation failed: ${JSON.stringify(result)}`);
      }

      attempts++;
    }

    throw new Error("Polling timeout: Request took too long to complete");
  };

  // Available Flux AI models
  const aiModels = [
    {
      id: "flux-kontext-pro",
      name: "Flux Kontext Pro",
      description: "Professional image editing with context awareness",
      speed: "Medium",
      quality: "Highest",
    },
    {
      id: "flux-schnell",
      name: "Flux Schnell",
      description: "Fast image editing",
      speed: "Fast",
      quality: "High",
    },
    {
      id: "flux-dev",
      name: "Flux Dev",
      description: "Development model for experimental features",
      speed: "Medium",
      quality: "Very High",
    },
  ];

  const editingOptions = [
    {
      id: "enhance",
      title: "Instant Effects (Local)",
      description: "Apply instant effects to your uploaded image",
      icon: <FaAdjust />,
      prompts: [
        "enhance the colors and contrast",
        "apply vintage sepia effect",
        "make it warm and cozy",
        "add cool blue tones",
        "convert to grayscale",
        "brighten the image",
        "darken the image",
        "invert the colors",
        "blur the image",
        "sharpen the image",
      ],
    },
    {
      id: "style",
      title: "AI Style Transfer (Flux Kontext)",
      description: "Apply artistic styles while maintaining composition",
      icon: <FaPalette />,
      prompts: [
        "Transform to Van Gogh style with visible brushstrokes and thick paint texture, while maintaining the original composition",
        "Convert to watercolor painting with soft edges and transparent washes, keeping the same subject positioning",
        "Change to oil painting with visible brushstrokes, thick paint texture, while preserving facial features and composition",
        "Transform to Bauhaus art style while maintaining the original composition and subject placement",
        "Convert to pencil sketch with natural graphite lines, cross-hatching, and visible paper texture",
        "Change to anime/manga art style while maintaining the same facial features and expression",
        "Transform to impressionist style with loose brushwork and light effects, keeping the original composition",
        "Convert to digital art style with clean lines and vibrant colors, preserving character details",
      ],
    },
    {
      id: "character",
      title: "Character Consistency",
      description: "Modify while preserving character features",
      icon: <FaEdit />,
      prompts: [
        "Change the clothes to formal attire while preserving facial features, hairstyle, and expression",
        "Change the background to a beach while keeping the person in the exact same position, scale, and pose",
        "Change the lighting to golden hour while maintaining the same facial features and composition",
        "Add a hat while preserving the same facial features, hairstyle, and expression",
        "Change to winter clothing while maintaining the same pose, facial features, and body position",
        "Change the background to a modern office while keeping the subject in the exact same position",
        "Change the clothes to casual wear while preserving all facial features and body pose",
        "Change to nighttime scene while maintaining the same character positioning and features",
      ],
    },
    {
      id: "objects",
      title: "Object Modification",
      description: "Modify specific objects while preserving context",
      icon: <FaEraser />,
      prompts: [
        "Change the car color to red while keeping everything else unchanged",
        "Replace the phone with a book, maintain the same hand position and pose",
        "Change the flower vase to a lamp while keeping the same table and background",
        "Replace the coffee cup with a wine glass, keep the same hand gesture",
        "Change the bicycle to a motorcycle while maintaining the same scene composition",
        "Replace the dog with a cat while keeping the same pose and environment",
        "Change the wooden chair to a modern chair while preserving the room layout",
        "Replace the old car with a modern one while keeping the same street scene",
      ],
    },
    {
      id: "background",
      title: "Background Replacement",
      description: "Change backgrounds while preserving subjects",
      icon: <FaImage />,
      prompts: [
        "Change the background to a beautiful sunset while keeping the subject in the exact same position and pose",
        "Replace the background with a modern office setting, maintain the person's exact positioning",
        "Change the background to a magical forest while preserving the subject's scale and pose",
        "Replace the background with a city skyline, keep the subject in the same position",
        "Change the background to a beach scene while maintaining the exact same subject positioning",
        "Replace the background with a mountain landscape, preserve all subject details and positioning",
        "Change the background to a library while keeping the person in the exact same pose",
        "Replace the background with a starry night sky, maintain subject positioning and scale",
      ],
    },
    {
      id: "text",
      title: "Text Editing",
      description: "Edit text while maintaining style",
      icon: <FaMagic />,
      prompts: [
        "Replace 'SALE' with 'NEW' while maintaining the same font style and color",
        "Change 'Welcome' to 'Hello' while keeping the same text formatting",
        "Replace 'Open' with 'Closed' while maintaining the same sign style",
        "Change '2023' to '2024' while keeping the same text appearance",
        "Replace 'Coffee' with 'Tea' while maintaining the same font and background",
        "Change 'Exit' to 'Enter' while keeping the same sign design",
        "Replace 'Stop' with 'Go' while maintaining the same text styling",
        "Change 'Monday' to 'Friday' while keeping the same calendar format",
      ],
    },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          setUploadedImage(imageUrl);
          setEditedImage(null);
          setEditHistory([
            { original: imageUrl, edited: null, prompt: "Original" },
          ]);
          setCurrentEditIndex(0);
          setError("");
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please upload a valid image file.");
      }
    }
  };

  // Function to apply local image filters and effects
  const applyLocalImageEffects = (imageUrl, effectType) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Get image data for manipulation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply different effects based on the effect type
        switch (effectType) {
          case "vintage":
            // Apply sepia and vignette effect
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];

              // Sepia formula
              data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
              data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
              data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
            }
            break;

          case "enhance":
            // Increase contrast and saturation
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.3 + 128)); // Red
              data[i + 1] = Math.min(
                255,
                Math.max(0, (data[i + 1] - 128) * 1.3 + 128)
              ); // Green
              data[i + 2] = Math.min(
                255,
                Math.max(0, (data[i + 2] - 128) * 1.3 + 128)
              ); // Blue
            }
            break;

          case "cool":
            // Add blue tint
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.max(0, data[i] - 15); // Reduce red
              data[i + 1] = Math.max(0, data[i + 1] - 5); // Reduce green slightly
              data[i + 2] = Math.min(255, data[i + 2] + 20); // Increase blue
            }
            break;

          case "warm":
            // Add warm tint
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, data[i] + 20); // Increase red
              data[i + 1] = Math.min(255, data[i + 1] + 10); // Increase green
              data[i + 2] = Math.max(0, data[i + 2] - 15); // Reduce blue
            }
            break;

          case "grayscale":
            // Convert to grayscale
            for (let i = 0; i < data.length; i += 4) {
              const gray =
                data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
              data[i] = gray;
              data[i + 1] = gray;
              data[i + 2] = gray;
            }
            break;

          case "brighten":
            // Brighten the image
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, data[i] + 30);
              data[i + 1] = Math.min(255, data[i + 1] + 30);
              data[i + 2] = Math.min(255, data[i + 2] + 30);
            }
            break;

          case "darken":
            // Darken the image
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.max(0, data[i] - 30);
              data[i + 1] = Math.max(0, data[i + 1] - 30);
              data[i + 2] = Math.max(0, data[i + 2] - 30);
            }
            break;

          case "invert":
            // Invert colors
            for (let i = 0; i < data.length; i += 4) {
              data[i] = 255 - data[i];
              data[i + 1] = 255 - data[i + 1];
              data[i + 2] = 255 - data[i + 2];
            }
            break;

          case "blur":
            // Simple blur effect (basic implementation)
            const tempData = new Uint8ClampedArray(data);
            const width = canvas.width;
            const height = canvas.height;

            for (let y = 1; y < height - 1; y++) {
              for (let x = 1; x < width - 1; x++) {
                const i = (y * width + x) * 4;

                // Average with surrounding pixels
                for (let c = 0; c < 3; c++) {
                  let sum = 0;
                  for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                      const ni = ((y + dy) * width + (x + dx)) * 4 + c;
                      sum += tempData[ni];
                    }
                  }
                  data[i + c] = sum / 9;
                }
              }
            }
            break;

          case "sharpen":
            // Sharpen effect
            const sharpData = new Uint8ClampedArray(data);
            const sharpWidth = canvas.width;
            const sharpHeight = canvas.height;

            for (let y = 1; y < sharpHeight - 1; y++) {
              for (let x = 1; x < sharpWidth - 1; x++) {
                const i = (y * sharpWidth + x) * 4;

                for (let c = 0; c < 3; c++) {
                  const center = sharpData[i + c];
                  const surrounding =
                    (sharpData[((y - 1) * sharpWidth + x) * 4 + c] +
                      sharpData[((y + 1) * sharpWidth + x) * 4 + c] +
                      sharpData[(y * sharpWidth + (x - 1)) * 4 + c] +
                      sharpData[(y * sharpWidth + (x + 1)) * 4 + c]) /
                    4;

                  data[i + c] = Math.min(
                    255,
                    Math.max(0, center + (center - surrounding) * 0.5)
                  );
                }
              }
            }
            break;

          default:
            // No effect, keep original
            break;
        }

        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to data URL
        const editedImageUrl = canvas.toDataURL("image/jpeg", 0.9);
        resolve(editedImageUrl);
      };

      img.src = imageUrl;
    });
  };

  // Function to detect effect type from prompt
  const detectEffectType = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();

    if (
      lowerPrompt.includes("vintage") ||
      lowerPrompt.includes("sepia") ||
      lowerPrompt.includes("old") ||
      lowerPrompt.includes("retro")
    ) {
      return "vintage";
    } else if (
      lowerPrompt.includes("enhance") ||
      lowerPrompt.includes("vibrant") ||
      lowerPrompt.includes("contrast")
    ) {
      return "enhance";
    } else if (
      lowerPrompt.includes("cool") ||
      lowerPrompt.includes("blue") ||
      lowerPrompt.includes("cold")
    ) {
      return "cool";
    } else if (
      lowerPrompt.includes("warm") ||
      lowerPrompt.includes("orange") ||
      lowerPrompt.includes("sunset")
    ) {
      return "warm";
    } else if (
      lowerPrompt.includes("grayscale") ||
      lowerPrompt.includes("black and white") ||
      lowerPrompt.includes("monochrome")
    ) {
      return "grayscale";
    } else if (
      lowerPrompt.includes("bright") ||
      lowerPrompt.includes("lighter")
    ) {
      return "brighten";
    } else if (lowerPrompt.includes("dark") || lowerPrompt.includes("darker")) {
      return "darken";
    } else if (
      lowerPrompt.includes("invert") ||
      lowerPrompt.includes("negative")
    ) {
      return "invert";
    } else if (lowerPrompt.includes("blur") || lowerPrompt.includes("soft")) {
      return "blur";
    } else if (lowerPrompt.includes("sharp") || lowerPrompt.includes("crisp")) {
      return "sharpen";
    }

    return "ai"; // Use AI for complex effects
  };

  // Construct optimized prompts based on Flux Kontext best practices
  const constructFluxKontextPrompt = (userPrompt) => {
    const lowerPrompt = userPrompt.toLowerCase();

    // If the prompt already seems well-structured, use it as-is
    if (
      lowerPrompt.includes("while maintaining") ||
      lowerPrompt.includes("while preserving") ||
      (lowerPrompt.includes("keep") && lowerPrompt.includes("same"))
    ) {
      return userPrompt;
    }

    // Apply Flux Kontext principles based on prompt type
    if (
      lowerPrompt.includes("style") ||
      lowerPrompt.includes("transform") ||
      lowerPrompt.includes("convert")
    ) {
      // Style transfer - preserve composition
      return `${userPrompt} while maintaining the original composition and subject positioning`;
    } else if (lowerPrompt.includes("background")) {
      // Background changes - preserve subject
      return `${userPrompt} while keeping the subject in the exact same position, scale, and pose`;
    } else if (
      lowerPrompt.includes("change") &&
      (lowerPrompt.includes("color") ||
        lowerPrompt.includes("clothes") ||
        lowerPrompt.includes("clothing"))
    ) {
      // Object/clothing changes - preserve character features
      return `${userPrompt} while preserving facial features, pose, and overall composition`;
    } else if (
      lowerPrompt.includes("replace") ||
      lowerPrompt.includes("remove")
    ) {
      // Object replacement/removal - preserve context
      return `${userPrompt} while keeping everything else unchanged`;
    } else if (lowerPrompt.includes("add") || lowerPrompt.includes("put")) {
      // Adding elements - preserve original subject
      return `${userPrompt} while maintaining the original subject and composition`;
    } else {
      // General enhancement - preserve key elements
      return `${userPrompt}. Apply this effect while maintaining the original composition, subjects, and key visual elements of the image`;
    }
  };

  const generateEditedImage = async (prompt) => {
    if (!uploadedImage || !prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const effectType = detectEffectType(prompt);

      let newImageUrl;

      if (effectType === "ai") {
        // Try Flux AI for complex effects, but fall back to local processing if it fails
        try {
          if (!BFL_API_KEY || BFL_API_KEY === "your-bfl-api-key-here") {
            throw new Error(
              "BFL_API_KEY not configured. Please set VITE_BFL_API_KEY environment variable."
            );
          }

          // Construct Flux Kontext optimized prompt
          const editingPrompt = constructFluxKontextPrompt(prompt);

          // Convert image to base64
          const base64Image = await imageToBase64(uploadedImage);

          // Make Flux API request
          const requestResult = await makeFluxRequest(
            editingPrompt,
            base64Image
          );

          if (!requestResult.polling_url) {
            throw new Error("No polling URL returned from Flux API");
          }

          // Poll for result
          newImageUrl = await pollForResult(requestResult.polling_url);

          if (!newImageUrl) {
            throw new Error("No edited image returned from Flux AI");
          }
        } catch (aiError) {
          console.warn(
            "Flux AI processing failed, trying local fallback:",
            aiError
          );

          // Try to apply a local effect as fallback
          const fallbackEffect = detectFallbackEffect(prompt);
          if (fallbackEffect) {
            newImageUrl = await applyLocalImageEffects(
              uploadedImage,
              fallbackEffect
            );
            setError(
              `Flux AI processing unavailable: ${aiError.message}. Applied local '${fallbackEffect}' effect instead. Please check your BFL_API_KEY and try again.`
            );
          } else {
            throw new Error(
              `Flux AI service unavailable (${aiError.message}). Try using keywords like 'enhance', 'vintage', 'warm', 'cool', 'bright', 'dark', or 'grayscale' for instant local effects.`
            );
          }
        }
      } else {
        // Use local image processing for basic effects
        newImageUrl = await applyLocalImageEffects(uploadedImage, effectType);
      }

      if (newImageUrl) {
        setEditedImage(newImageUrl);

        // Add to history
        const newHistoryItem = {
          original: uploadedImage,
          edited: newImageUrl,
          prompt: prompt,
          timestamp: new Date(),
          method:
            effectType === "ai"
              ? error
                ? "Local Fallback"
                : "Flux AI"
              : "Local Filter",
        };

        const newHistory = [
          ...editHistory.slice(0, currentEditIndex + 1),
          newHistoryItem,
        ];
        setEditHistory(newHistory);
        setCurrentEditIndex(newHistory.length - 1);
      } else {
        throw new Error("Failed to generate edited image");
      }
    } catch (err) {
      console.error("Error editing image:", err);
      setError(
        `Failed to edit image: ${err.message}. Try using keywords like 'enhance', 'vintage', 'warm', 'cool', 'bright', 'dark', or 'grayscale' for instant local effects.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to detect fallback local effects for AI prompts
  const detectFallbackEffect = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();

    if (
      lowerPrompt.includes("enhance") ||
      lowerPrompt.includes("improve") ||
      lowerPrompt.includes("better")
    ) {
      return "enhance";
    } else if (
      lowerPrompt.includes("vintage") ||
      lowerPrompt.includes("old") ||
      lowerPrompt.includes("retro")
    ) {
      return "vintage";
    } else if (
      lowerPrompt.includes("warm") ||
      lowerPrompt.includes("orange") ||
      lowerPrompt.includes("sunset")
    ) {
      return "warm";
    } else if (
      lowerPrompt.includes("cool") ||
      lowerPrompt.includes("blue") ||
      lowerPrompt.includes("cold")
    ) {
      return "cool";
    } else if (
      lowerPrompt.includes("gray") ||
      lowerPrompt.includes("black") ||
      lowerPrompt.includes("white")
    ) {
      return "grayscale";
    } else if (
      lowerPrompt.includes("bright") ||
      lowerPrompt.includes("light")
    ) {
      return "brighten";
    } else if (lowerPrompt.includes("dark")) {
      return "darken";
    }

    return null; // No suitable fallback
  };

  const handleCustomEdit = () => {
    if (editPrompt.trim()) {
      generateEditedImage(editPrompt);
      setEditPrompt("");
    }
  };

  const handleUndo = () => {
    if (currentEditIndex > 0) {
      setCurrentEditIndex(currentEditIndex - 1);
      const previousEdit = editHistory[currentEditIndex - 1];
      setEditedImage(previousEdit.edited);
    }
  };

  const handleRedo = () => {
    if (currentEditIndex < editHistory.length - 1) {
      setCurrentEditIndex(currentEditIndex + 1);
      const nextEdit = editHistory[currentEditIndex + 1];
      setEditedImage(nextEdit.edited);
    }
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `edited-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const resetEditor = () => {
    setUploadedImage(null);
    setEditedImage(null);
    setEditHistory([]);
    setCurrentEditIndex(-1);
    setEditPrompt("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "28px", color: "var(--text)" }}>Image Editor</h1>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)" }}>FLUX KONTEXT · BFL</span>
      </div>

      {!uploadedImage ? (
        /* ── Upload screen ── */
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 65px)", padding: "32px" }}>
          <div style={{ textAlign: "center", maxWidth: "480px", width: "100%" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "64px", color: "var(--text-dim)", marginBottom: "16px" }}>↑</div>
            <h2 className="serif-display" style={{ fontSize: "28px", marginBottom: "8px" }}>Upload Your Image</h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px", lineHeight: 1.9, marginBottom: "24px" }}>
              Choose an image to start editing with AI-powered tools
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current?.click()} className="btn-gold" style={{ marginBottom: "12px" }}>
              Choose Image
            </button>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-dim)", letterSpacing: "1px", marginTop: "12px" }}>
              JPG · PNG · GIF · WEBP
            </div>
            {error && (
              <div style={{ marginTop: "16px", border: "1px solid #5a2020", background: "#1a0a0a", padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "9px", color: "#c47070" }}>{error}</div>
            )}
          </div>
        </div>
      ) : (
        /* ── Editing interface ── */
        <div className="grid-sidebar-wide">

          {/* ── Left panel — tools ── */}
          <div className="panel-border-r" style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>

            {/* Controls: undo/redo + model + custom prompt */}
            <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>Controls</div>

              {/* Undo / Redo */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {[
                  { label: "Undo", action: handleUndo, disabled: currentEditIndex <= 0 },
                  { label: "Redo", action: handleRedo, disabled: currentEditIndex >= editHistory.length - 1 },
                ].map(({ label, action, disabled }) => (
                  <button key={label} onClick={action} disabled={disabled}
                    style={{ flex: 1, padding: "7px", background: "transparent", border: `1px solid ${disabled ? "var(--border-light)" : "var(--border)"}`, fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase", color: disabled ? "var(--text-dim)" : "var(--text-muted)", cursor: disabled ? "not-allowed" : "pointer", transition: "color 0.2s, border-color 0.2s" }}
                    onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text-muted)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = disabled ? "var(--text-dim)" : "var(--text-muted)"; e.currentTarget.style.borderColor = disabled ? "var(--border-light)" : "var(--border)"; }}
                  >{label}</button>
                ))}
              </div>

              {/* Model selector */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>AI Model</div>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
                  style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "9px", padding: "8px", outline: "none", cursor: "pointer" }}
                >
                  {aiModels.map((model) => (
                    <option key={model.id} value={model.id} style={{ background: "var(--surface-2)" }}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "7px", color: "var(--text-dim)" }}>Speed: {aiModels.find((m) => m.id === selectedModel)?.speed}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "7px", color: "var(--text-dim)" }}>Quality: {aiModels.find((m) => m.id === selectedModel)?.quality}</span>
                </div>
              </div>

              {/* Custom edit prompt */}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>Custom Edit</div>
              <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                <input
                  type="text"
                  placeholder="e.g., Change the car color to red..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCustomEdit()}
                  style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "8px", padding: "7px 8px", outline: "none", transition: "border-color 0.2s" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button onClick={handleCustomEdit} disabled={!editPrompt.trim() || loading}
                  style={{ padding: "7px 12px", background: "transparent", border: `1px solid ${!editPrompt.trim() || loading ? "var(--border-light)" : "var(--gold)"}`, fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1px", color: !editPrompt.trim() || loading ? "var(--text-dim)" : "var(--gold)", cursor: !editPrompt.trim() || loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                >Edit</button>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
                <button onClick={() => downloadImage(editedImage || uploadedImage, "edited-image.jpg")} className="btn-gold" style={{ width: "100%" }}>Download Image</button>
                <button onClick={resetEditor} className="btn-outline" style={{ width: "100%" }}>Start Over</button>
              </div>
            </div>

            {/* Quick edit options */}
            <div style={{ padding: "20px", flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>Edit Options</div>
              {editingOptions.map((option) => (
                <div key={option.id} style={{ marginBottom: "16px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-muted)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px", paddingBottom: "6px", borderBottom: "1px solid var(--border-light)" }}>
                    {option.title}
                  </div>
                  {option.prompts.map((prompt, index) => (
                    <button key={index} onClick={() => generateEditedImage(prompt)} disabled={loading}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 0", background: "transparent", border: "none", borderBottom: "1px solid var(--border-light)", fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-muted)", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.5px", lineHeight: 1.5, transition: "color 0.2s" }}
                      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.color = "var(--gold)"; }}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >{prompt}</button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right panel — image display ── */}
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="grid-2col" style={{ gap: "16px" }}>

              {/* Original */}
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Original</div>
                <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", aspectRatio: "1", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={uploadedImage} alt="Original" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>

              {/* Edited */}
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                  {loading ? "Processing..." : "Edited"}
                </div>
                <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", aspectRatio: "1", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  {loading ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: "28px", height: "28px", border: "1px solid var(--border)", borderTop: "1px solid var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 10px" }} />
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase" }}>Working</div>
                    </div>
                  ) : editedImage ? (
                    <img src={editedImage} alt="Edited" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ textAlign: "center", padding: "16px" }}>
                      <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "32px", color: "var(--text-dim)", marginBottom: "8px" }}>✦</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1px", color: "var(--text-dim)", textTransform: "uppercase" }}>Choose an option</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            {editedImage && (
              <div className="grid-stats" style={{ gap: "8px" }}>
                {[
                  ["1024×1024", "Resolution"],
                  [editHistory[currentEditIndex]?.method || "AI", "Method"],
                  [aiModels.find((m) => m.id === selectedModel)?.name || "Flux", "Model"],
                  ["High Quality", "Output"],
                ].map(([val, lbl]) => (
                  <div key={lbl} style={{ border: "1px solid var(--border)", padding: "10px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text)", marginBottom: "3px" }}>{val}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "7px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit history */}
            {editHistory.length > 1 && (
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>History</div>
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                  {editHistory.map((item, index) => (
                    <button key={index}
                      onClick={() => { setCurrentEditIndex(index); setEditedImage(item.edited); }}
                      style={{ flexShrink: 0, width: "56px", height: "56px", overflow: "hidden", border: `1px solid ${index === currentEditIndex ? "var(--gold)" : "var(--border)"}`, background: "var(--surface-2)", padding: 0, cursor: "pointer", transition: "border-color 0.2s" }}
                    >
                      <img src={item.edited || item.original} alt={`Edit ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ border: "1px solid #5a2020", background: "#1a0a0a", padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "9px", color: "#c47070", letterSpacing: "0.5px", lineHeight: 1.6 }}>{error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageEditor;
