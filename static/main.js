function saveName() {
    var name = document.getElementById('user-name').value;
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("user_id");
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/save_name', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ name: name, uid: uid }));
  }
  function loadDetails() {
    console.log("loading details...");

    // Get the user_id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("user_id");

    // Fetch the user details from the backend
    fetch(`/get-user-details?user_id=${uid}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
        if (data.success) {
          const details = document.getElementById("cemetery-name").value;
 

          let detailsObj = null; 
          if (isJsonString(details)) {
            detailsObj = JSON.parse(details);
            // Now you can use detailsObj as a JavaScript object
          } else {
              console.error('Details is not a valid JSON string:', details);
          }
          // console.log(parseddetails)

          // Set the input values
          document.getElementById('cemetery-name').value = detailsObj.cemeteryName || '';
          document.getElementById('cemetery-address').value = detailsObj.cemeteryAddress || '';
          document.getElementById('google-maps-link').value = detailsObj.googleMapsLink || '';

          // Make the fields readonly
          document.getElementById('cemetery-name').readOnly = true;
          document.getElementById('cemetery-address').readOnly = true;
          document.getElementById('google-maps-link').readOnly = true;
        } else {
          console.error('Failed to load user details:', data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  }
  function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

  // Call loadDetails when the page loads
  window.onload = function() {
    loadDetails();
  };


  document.getElementById('upload-bg-button').addEventListener('click', function() {
    document.getElementById('background-image-input').click();
  });
  
  document.getElementById('background-image-input').addEventListener('change', function() {
    var backgroundImageUploadForm = document.getElementById('background-image-upload-form');
    
    var formData = new FormData(backgroundImageUploadForm);
  
    fetch('/update-background-image', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update the background image
        var userProfile = document.querySelector('.user-profile');
        userProfile.style.backgroundImage = 'url(' + data.imageUrl + ')';
      } else {
        alert('Failed to upload image: ' + data.message);
      }
    });
  });
  
  window.onload = function () {
    
    const bioElement = document.querySelector(".user-bio");
    bioElement.innerHTML = bioElement.innerText.replace(/\n/g, '<br>');
    const bioWords = bioElement.innerText.split(" ");
    if (window.innerWidth <= 768 && bioWords.length > 4) {
      // Limit to 4 words on mobile devices
      bioElement.innerText = bioWords.slice(0, 4).join(" ") + "...";
    } else if (bioElement.innerText.length > 10000) {
      // Limit to 100 characters on larger screens
      bioElement.innerText = bioElement.innerText.slice(0, 100) + "...";
    }
  };
  function saveDetails() {
    const details = {
      cemeteryName: document.getElementById("cemetery-name").value,
      cemeteryAddress: document.getElementById("cemetery-address").value,
      googleMapsLink: document.getElementById("google-maps-link").value
    };
  
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("user_id");
  
    fetch("/update-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: uid, details: details }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the data from the response
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }
  document.getElementById("video-upload-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    var formData = new FormData(event.target);
    var link = formData.get("link");
    var videoId = link.split("v=")[1].split("&")[0]; // Extract the video ID from the YouTube URL
  
    fetch("/add-video", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Create elements for the title, description, and video
          var title = document.createElement("h3");
          title.textContent = formData.get("title");
  
          var description = document.createElement("p");
          description.textContent = formData.get("description");
  
          var videoWrapper = document.createElement("div");
          videoWrapper.className = "video-wrapper";
  
          var iframe = document.createElement("iframe");
          iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}`);
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("allowfullscreen", "");
          iframe.classList.add("responsive-iframe");
  
          videoWrapper.appendChild(iframe);
  
          var videoItem = document.createElement("div");
          videoItem.className = "image-item"; // Make sure this matches your CSS class
          videoItem.appendChild(videoWrapper);
  
          var video = document.createElement("div");
  
          var removeButton = document.createElement("button");
          removeButton.textContent = "Eliminar";
          removeButton.className = "remove-button editable";
          removeButton.style.display = "none"; // Hide the button by default
          removeButton.dataset.videoId = videoId;
  
          video.className = "youtube-video";
          video.appendChild(title);
          video.appendChild(videoWrapper);
          video.appendChild(description);
          video.appendChild(removeButton);
  
          video.dataset.videoId = videoId;
          video.dataset.videoId = videoId;
  
          // Add the new video to the user's videos
          document.getElementById("user-videos").appendChild(video);
        } else {
          alert("Failed to add video: " + data.message);
        }
      });
  });

    

    function loadVideos() {
      const urlParams = new URLSearchParams(window.location.search);
      const uid = urlParams.get("user_id");
      fetch(`/get-user-videos/${uid}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            var videosContainer = document.getElementById("user-videos");
            videosContainer.innerHTML = ''; // Clear existing videos if needed
            data.videos.forEach(function (videoData) {
              // Create elements for the title, description, and video
              var title = document.createElement("h3");
              title.textContent = videoData.title;
    
              var description = document.createElement("p");
              description.textContent = videoData.description;
    
              // Create the iframe using the video ID
              var iframe = document.createElement("iframe");
              iframe.setAttribute("src", `https://www.youtube.com/embed/${videoData.videoId}`);
              iframe.setAttribute("frameborder", "0");
              iframe.setAttribute("allowfullscreen", "");
              iframe.classList.add("responsive-iframe");
    
              // Create a wrapper for the video and add the iframe to it
              var videoWrapper = document.createElement("div");
              videoWrapper.className = "video-wrapper";
              videoWrapper.appendChild(iframe);
    
              // Create a container for the entire video item
              var videoItem = document.createElement("div");
              videoItem.className = "image-item"; // Use the same class as your CSS for styling
    
              // Append title, video wrapper, and description to the video item
              videoItem.appendChild(title);
              videoItem.appendChild(videoWrapper);
              videoItem.appendChild(description);
    
              // Create the "Eliminar" button
              var removeButton = document.createElement("button");
              removeButton.textContent = "Eliminar";
              removeButton.className = "remove-button editable-section";
              removeButton.dataset.videoId = videoData.videoId; // Store the video ID in the button
    
              removeButton.addEventListener("click", function () {
                // Send a request to the server to delete the video
                fetch("/remove-video", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ video_id: this.dataset.videoId }), // Send the video ID to the server
                })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    // If the server successfully deleted the video, remove it from the frontend
                    videoItem.remove();
                  } else {
                    alert("Failed to remove video: " + data.message);
                  }
                });
              });
    
              // Append the button to the video item
              videoItem.appendChild(removeButton);
    
              // Append the video item to the videos container
              videosContainer.appendChild(videoItem);
            });
          } else {
            alert("Failed to fetch videos: " + data.message);
          }
        }).catch(error => {
          console.error('Error fetching videos:', error);
          alert("An error occurred while fetching videos.");
        });
    }
    
    document.addEventListener('DOMContentLoaded', loadVideos);
  let imageCount = 0;

  document.getElementById('image-upload-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    var imageUploadForm = document.getElementById('image-upload-form');
    var formData = new FormData(imageUploadForm);
  
    fetch('/upload-user-image', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Create elements for the title, description, and image
        var title = document.createElement("h3");
        title.textContent = formData.get("title");
  
        var description = document.createElement("p");
        description.textContent = formData.get("description");
  
        var img = document.createElement("img");
        img.src = data.imageUrl;
  
        // Create a container for the new image item
        var div = document.createElement("div");
        div.className = "image-item";
        
        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(description);
  
        // Add the new image item to the user's images
        document.getElementById("user-images").appendChild(div);
      } else {
        alert('Failed to upload image: ' + data.message);
      }
    });
  });
  openTab(null, "About");
  document.addEventListener('DOMContentLoaded', function() {
    var editButton = document.getElementById('edit-button');
  
    editButton.addEventListener('click', function() {
      openModal();
    });
  });
  // Load the user's images when the page loads
  window.addEventListener("load", function () {
    // Fetch and display the user's images
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("user_id");

    fetch(`/user-images/${uid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Add each image to the user's images
          data.images.forEach(function (imageData) {
            var img = document.createElement("img");
            img.src = imageData.url;

            var title = document.createElement("h3");
            title.textContent = imageData.title;

            var description = document.createElement("p");
            description.textContent = imageData.description;

            var div = document.createElement("div");
            div.className = "image-item";
            
            div.appendChild(img);
            div.appendChild(title);
            div.appendChild(description);

            var removeButton = document.createElement("button");
            removeButton.textContent = "Eliminar";
            removeButton.className = "remove-button";
            removeButton.style.display = isEditingEnabled ? "block" : "none"; // Show the button only in edit mode
            removeButton.dataset.imageId = imageData.id; // Store the image ID in the button
            console.log(imageData.id);

            removeButton.addEventListener("click", function () {
              // Send a request to the server to delete the image
              fetch("/delete-image", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ imageId: this.dataset.imageId }), // Send the image ID to the server
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    // If the server successfully deleted the image, remove it from the frontend
                    this.parentElement.remove();
                  } else {
                    console.error("Failed to delete image: " + data.message);
                  }
                });
            });

            // Append the button to the image item
            div.appendChild(removeButton);

            document.getElementById("user-images").appendChild(div);
            imageCount++; // Increment the image count
          });
        } else {
          alert("Failed to load user images: " + data.message);
        }
        
      });

        // ... existing openTab code ...
      
        // Check if the Details tab is opened
        
  });
  function uploadImage(event) {
    event.preventDefault(); // Prevent the default action
    if (isEditingEnabled) {
      // Trigger image upload only if editing is enabled
      const imageUpload = document.getElementById("image-upload");
      imageUpload.click();
    }
  }
  document.getElementById('edit-profile-image-button').addEventListener('click', function() {
    document.getElementById('profile-image-input').click();
  });
  
  document.getElementById('profile-image-input').addEventListener('change', function() {
    var profileImageUploadForm = document.getElementById('profile-image-upload-form');
    
    var formData = new FormData(profileImageUploadForm);
  
    fetch('/update-profile-image', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update the profile image
        var userImage = document.querySelector('.user-image');
        userImage.src = data.imageUrl;
      } else {
        alert('Failed to upload image: ' + data.message);
      }
    });
  });
  window.onload = function () {
    loadDetails();
  
    const profileImageInput = document.getElementById('profile-image-input');
    const profileImageUploadForm = document.getElementById('profile-image-upload-form');
    const editImageButton = document.querySelector('.edit-image-button');
  
    editImageButton.addEventListener('click', function() {
      profileImageInput.click();
    });
  
    profileImageUploadForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      var formData = new FormData(event.target);
  
      fetch('/update-profile-image', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Update the profile image
          document.querySelector('.user-image').src = data.imageUrl;
        } else {
          alert('Failed to upload image: ' + data.message);
        }
      });
    });
  
    // Other code...
  };
  function openModal() {
    document.getElementById("passwordModal").style.display = "block";
  }
  
  function closeModal() {
    document.getElementById("passwordModal").style.display = "none";
    document
      .getElementById("passwordInput")
      .classList.remove("incorrect-password");
  }
  document.addEventListener('click', function(event) {
    var passwordModal = document.getElementById('passwordModal');
    if (event.target == passwordModal) {
      passwordModal.style.display = 'none';
    }
  });
  function submitForm() {
    const passwordInput = document.getElementById("passwordInput");
    const password = passwordInput.value;
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("user_id");
    fetch("/check-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: uid, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.passwordAccepted) {
          closeModal();
          enableEditing();

          
        } else {
          alert("Password Incorrect");
          passwordInput.classList.add("incorrect-password");
        }
      });
  }

  function openAboutModal() {
    document.getElementById("aboutModal").style.display = "block";
    document.getElementById("bioInput").value =
      document.getElementById("user-bio").innerText;
    document.getElementById("ageInput").value =
      document.getElementById("user-age").innerText;
  }
  function closeAboutModal() {
    document.getElementById("aboutModal").style.display = "none";
  }
  window.onload = function () {
    // Select the element that contains the birthday and deathday
    const userAgeElement = document.querySelector(".user-age");
  
    // Check if the userAgeElement exists to avoid null reference errors
    if (userAgeElement) {
      // Split the text content of the userAgeElement by ' - ' to separate birthday and deathday
      const [birthday, deathday] = userAgeElement.textContent.split(' - ');
  
      // Format and display the birthday if it's not 'None', otherwise display 'Desconocido'
      userAgeElement.textContent = birthday && birthday !== 'None' ? formatDate(birthday) : 'Desconocido';
  
      // Append the formatted deathday if it's not 'None', otherwise append ' - None'
      userAgeElement.textContent += deathday && deathday !== 'None' ? ` - ${formatDate(deathday)}` : ' - None';
    }
  
    const birthdayInput = document.getElementById("user-birthday");
    const deathdayInput = document.getElementById("user-deathday");
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("user_id");
  
    birthdayInput.addEventListener("change", function () {
      // Update birthday
      const birthday = birthdayInput.value; 
      fetch("/update-birthday", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, birthday: birthday }),
      }).then((response) => response.json());
    });
  
    deathdayInput.addEventListener("change", function () {
      // Update deathday
      const deathday = deathdayInput.value;
      fetch("/update-deathdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, deathdate: deathday }),
      }).then((response) => response.json());
    });
  
    // Rest of your onload code...
  };

  function calculateAge(birthday) {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }

    return age;
  }
  
  function saveImage() {
    const imageUpload = document.getElementById("image-upload");
    const file = imageUpload.files[0];
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("user_id");
  
    if (file) {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append("image", file);
      formData.append("uid", uid); // Replace 'uid' with the actual user id
  
      // Send the request to the Flask server
      fetch("/upload-user-image", {  // Change the endpoint to '/upload-user-image'
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Update the user image on the page
            const userImage = document.querySelector(".user-image");
            userImage.src = data.imageUrl;
  
            // Additional code if needed for success
            console.log("Image uploaded successfully.");
          } else {
            // Handle failure
            console.error("Failed to upload image: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
  function openTab(evt, tabName) {
    if (evt) evt.preventDefault(); // Prevent the default button action only if there's an event

    // Hide all other tab contents
    var tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Remove the "active" class from all tabs
    tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    if (evt) evt.currentTarget.className += " active"; // Add "active" class only if there's an event
    if (tabName === 'Details') {
      loadDetails();
    
  }
  }
  function convertYouTubeLinksToEmbeds() {
    // Find all elements that may contain YouTube links
    const youtubeLinks = document.querySelectorAll(".youtube-link");

    youtubeLinks.forEach((link) => {
      const url = link.href;
      const videoId = extractYouTubeVideoId(url);

      if (videoId) {
        const embedHtml = createYouTubeEmbed(videoId);
        link.innerHTML = ""; // Clear the existing link content
        link.appendChild(embedHtml); // Append the embed iframe
      }
    });
  }

  function calculateAge(birthday, deathday) {
    let ageDiff = deathday - birthday; // Difference in milliseconds
    let ageDate = new Date(ageDiff); // Convert to a date
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Convert to years
}


  function extractYouTubeVideoId(url) {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return null;
    }
  }

  function createYouTubeEmbed(videoId) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}`);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "");
    iframe.classList.add("responsive-iframe");
    return iframe;
  }
  
  let isEditingEnabled = false; // Define isEditingEnabled in the global scope
  enableEditing();
  enableEditing();
  function enableEditing() {
    const editableElements = document.querySelectorAll(".editable");
    const userBirthday = document.getElementById("user-birthday");
    const userDeathday = document.getElementById("user-deathday");
    const applyButton = document.getElementById("age-apply-button");
    const userImage = document.querySelector(".user-image");
    const imageUploadLink = document.querySelector(".user-image-container a");
    const imageUploadForm = document.getElementById("image-upload-form");
    const videoUploadForm = document.getElementById("video-upload-form");
    const videoApplyButton = document.getElementById("video-apply-button");
    const detailsApplyButton = document.getElementById("details-apply-button");
    const detailsInput = document.querySelector("#user-details");
    const removeButtons = document.querySelectorAll(".remove-button");
    const editableSections = document.querySelectorAll('.editable-section');
    const bioInput = document.querySelector(".editable #user-bio");
  
    // Add the cemetery details elements
    const cemeteryName = document.getElementById('cemetery-name');
    const cemeteryAddress = document.getElementById('cemetery-address');
    const googleMapsLink = document.getElementById('google-maps-link');
  
    if (isEditingEnabled) {
      // Disable editing
      editableElements.forEach((element) => {
        element.contentEditable = "false";
        element.classList.remove("editing");
      });
  
      if (userBirthday) {
        userBirthday.disabled = true;
        userBirthday.classList.remove("editing");
      }
      if (userDeathday) {
        userDeathday.disabled = true;
        userDeathday.classList.remove("editing");
      }
      if (applyButton) applyButton.style.display = "none";
      if (userImage) userImage.classList.add("unselectable");
      if (imageUploadLink) imageUploadLink.style.pointerEvents = "none";
      if (imageUploadForm) imageUploadForm.style.display = "none";
      if (videoApplyButton) videoApplyButton.style.display = "none";
      if (detailsApplyButton) detailsApplyButton.style.display = "none";
      if (detailsInput) detailsInput.contentEditable = "false";
  
      // Hide the remove buttons
      removeButtons.forEach((button) => {
        button.style.display = "none";
      });
  
      if (videoUploadForm) videoUploadForm.style.display = "none";
  
      // Remove 'editing' class from parent of each 'editable-section'
      editableSections.forEach((section) => {
        section.parentElement.classList.remove('editing');
      });
      cemeteryName.readOnly = true;
      cemeteryAddress.readOnly = true;
      googleMapsLink.readOnly = true;
  
      // Make the textarea read-only
      if (bioInput) {
        bioInput.readOnly = true;
        bioInput.classList.remove("editing");
      }
    } else {
      // Enable editing
      editableElements.forEach((element) => {
        element.contentEditable = "true";
        element.classList.add("editing");
      });
  
      if (userBirthday) {
        userBirthday.disabled = false;
        userBirthday.classList.add("editing");
      }
      if (userDeathday) {
        userDeathday.disabled = false;
        userDeathday.classList.add("editing");
      }
      if (applyButton) applyButton.style.display = "block";
      if (userImage) userImage.classList.remove("unselectable");
      if (imageUploadLink) imageUploadLink.style.pointerEvents = "auto";
      if (imageUploadForm) imageUploadForm.style.display = "block";
      if (videoApplyButton) videoApplyButton.style.display = "block";
      if (detailsApplyButton) detailsApplyButton.style.display = "block";
      if (detailsInput) detailsInput.contentEditable = "true";
  
      // Show the remove buttons
      removeButtons.forEach((button) => {
        button.style.display = "block";
      });
  
      if (videoUploadForm) videoUploadForm.style.display = "block";
  
      // Add 'editing' class to parent of each 'editable-section'
      editableSections.forEach((section) => {
        section.parentElement.classList.add('editing');
      });
      cemeteryName.readOnly = false;
      cemeteryAddress.readOnly = false;
      googleMapsLink.readOnly = false;
  
      // Make the textarea editable
      if (bioInput) {
        bioInput.readOnly = false;
        bioInput.classList.add("editing");
      }
    }
  
    // Toggle the isEditingEnabled flag
    isEditingEnabled = !isEditingEnabled;
  }
  function refresh(){
    location.reload();
  }
  function resizeTextarea(id) {
    const textarea = document.getElementById(id);
    textarea.style.height = 'auto'; // Reset the height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to scroll height
  }
  
  // Call this function on page load and when the content of the textarea changes
  window.onload = function() {
    resizeTextarea('user-bio');
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const monthsInSpanish = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
  
    const day = date.getDate();
    const month = monthsInSpanish[date.getMonth()];
    const year = date.getFullYear();
  
    return `${month} ${day}, ${year}`;
  }
  function saveBio() {
    const bioInput = document.querySelector(".editable #user-bio");
  
    // Use value instead of innerHTML or innerText for textarea
    const bio = bioInput.value;
  
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("user_id");
    fetch("/update-bio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: uid, bio: bio }),
    }).then((response) => response.json());
  }
  window.onload = function() {
    const userAge = document.querySelector(".user-age");

    const [birthday, deathday] = userAge.textContent.split(' - ');
  
    // Display the formatted birthday
    const formattedBirthday = formatDate(birthday);
  
    // Display the formatted deathday
    const formattedDeathday = formatDate(deathday);
  
    // Select the HTML element where you want to display the dates
    const userAgeElement = document.querySelector(".user-age");
  
    // Set the innerText property of the element to the formatted dates
    userAgeElement.innerText = `${formattedBirthday} - ${formattedDeathday}`;
  
    resizeTextarea('user-bio');
  };

  
  function saveAge() {
    const birthdayInput = document.getElementById("user-birthday");
    const deathdayInput = document.getElementById("user-deathday");


  
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("user_id");
  
    // Update birthday
    fetch("/update-birthday", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: uid, birthday: birthdayInput.value }),
    }).then((response) => response.json());
  
    // Update deathday
    if (deathdayInput.value) {
      fetch("/update-deathdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, deathdate: deathdayInput.value }),
      }).then((response) => response.json());
    }
  }

  document.getElementById('share-button').addEventListener('click', function() {
    if (navigator.share) {
      // Web Share API for mobile devices
      navigator.share({
        title: document.title,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Clipboard API for desktop devices
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard'))
        .catch(console.error);
    }
  });