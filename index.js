const $form = document.querySelector(".form")
const $formSelect = document.querySelector(".form__select")
const $gallery = document.querySelector(".gallery")
const BreedsWithSubBreeds = []

async function getDogsBreeds() {

	const { message: dogBreeds } = await fetch("https://dog.ceo/api/breeds/list/all")
		.then(response => response.json())

	for (const breed in dogBreeds) {
		const $option = document.createElement("option")
		$option.innerHTML = breed
		$formSelect.appendChild($option)
	}

	$formSelect.addEventListener("change", (event) => {
		removeAllChildNodes($gallery)

		if (document.querySelector(".form__select--sub-breed")) {
			document.querySelector(".form__select--sub-breed").remove()
		}

		const breedSelected = event.target.value

		if (dogBreeds[breedSelected].length > 0) {
			const $select = document.createElement("select")
			$select.classList.add("form__select")
			$select.classList.add("form__select--sub-breed")
			const $option = document.createElement("option")
			$option.innerHTML = "All sub breeds"
			$select.appendChild($option)

			dogBreeds[breedSelected].forEach(subBreed => {
				const $option = document.createElement("option")
				$option.innerHTML = subBreed
				$select.appendChild($option)
			});

			$form.appendChild($select)
			$select.addEventListener("change", (event) => {
				removeAllChildNodes($gallery)
				const subBreedSelected = event.target.value
				getImages(breedSelected, subBreedSelected)
			})
		}
		getImages(breedSelected)
	})
}

async function getImages(breed, subBreed) {
	let images
	if (subBreed) {
		images = await fetch(`https://dog.ceo/api/breed/${breed}/${subBreed}/images/random/6`)
			.then(response => response.json()).then(response => response.message)
	} else {
		images = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/6`)
			.then(response => response.json()).then(response => response.message)
	}
	printImages(images)
}

function printImages(images) {
	images.forEach(image => {
		const $imageContainer = document.createElement("div")
		$imageContainer.classList.add("gallery__image-container")

		const $image = document.createElement("img")
		$image.classList.add("gallery__image")

		$image.src = image

		$imageContainer.appendChild($image)
		$gallery.appendChild($imageContainer)
	});
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

getDogsBreeds()

