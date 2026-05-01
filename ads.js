import { getFirestore, collection, onSnapshot, doc, deleteDoc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// Firestore: Display ads with edit/delete controls
onSnapshot(collection(db, "ads"), snapshot => {
  const saleDiv = document.getElementById("saleAds");
  if (!saleDiv) return;

  saleDiv.innerHTML = "";
  snapshot.forEach(docSnap => {
    const ad = docSnap.data();
    const adId = docSnap.id;
    const user = auth.currentUser;

    // Build ad card
    let adHTML = `
      <div class="ad-card">
        <h3>${ad.title}</h3>
        <p>${ad.description}</p>
        <small>Posted by ${ad.user}</small>
    `;

    // Show edit/delete only if current user is the uploader
    if (user && user.email === ad.user) {
      adHTML += `
        <button onclick="editAd('${adId}', '${ad.title}', '${ad.description}')">Edit</button>
        <button onclick="deleteAd('${adId}')">Delete</button>
      `;
    }

    adHTML += `</div>`;
    saleDiv.innerHTML += adHTML;
  });
});

// Delete ad
window.deleteAd = async function(adId) {
  await deleteDoc(doc(db, "ads", adId));
  console.log("Ad deleted:", adId);
};

// Edit ad
window.editAd = async function(adId, oldTitle, oldDescription) {
  const newTitle = prompt("Edit title:", oldTitle);
  const newDescription = prompt("Edit description:", oldDescription);

  if (newTitle && newDescription) {
    await updateDoc(doc(db, "ads", adId), {
      title: newTitle,
      description: newDescription
    });
    console.log("Ad updated:", adId);
  }
};
