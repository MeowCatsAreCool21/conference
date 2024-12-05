<script>
	import { onMount } from 'svelte';
	import Banner from '$lib/images/WebBanner2023.png';
	import figure1 from '$lib/images/figure1.png';
	import figure2 from '$lib/images/figure2.png';
	import figure3 from '$lib/images/figure3.png';
	import figure4 from '$lib/images/figure4.png';
	import ImageWithCaption from './ImageWithCaption.svelte';
	import presentation from '$lib/videos/ppt.mp4';

	let headers = [];
	let references = [];
	let referenceMap = new Map(); // Map for unique references
	let lastUpdated = 'Loading...';
	let tooltipVisible = false;

	let wordCount = 0;
	let abstractwords = 0;

	function calculateAbstractWordCount() {
		// Get the abstract content area
		const abstract = document.querySelector('#abstract');

		if (abstract) {
			// Extract the text content from the abstract
			const text = abstract.textContent || '';

			// Split the text into words and count them
			abstractwords = text.split(/\s+/).filter((word) => word.length > 0).length;
			return abstractwords;
		}
	}

	function calculateWordCount() {
		const content = document.querySelector('#content');
		const references = document.querySelector('#references');
		const abstract = document.querySelector('#abstract');
		const ppt = document.querySelector('#ppt');

		if (content) {
			// Get headers, paragraphs, table rows, and figure captions
			const elements = Array.from(
				content.querySelectorAll('h2, h3, h4, h5, h6, p, table th, table td, figcaption')
			).filter(
				(el) =>
					!references?.contains(el) && // Exclude references
					!abstract?.contains(el) &&
					!ppt?.contains(el) // Exclude abstract
			);

			const text = elements.map((el) => el.textContent).join(' ');
			// .replace(/\([^\)]+\)/g, '') // Remove parenthetical citations
			// .replace(/\[[^\]]+\]/g, ''); // Remove bracketed citations

			// Split words and count
			wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
		}
	}

	onMount(() => {
		updateHeaders();
		window.addEventListener('resize', updateHeaders);
		fetchLastUpdatedTime();
		calculateWordCount();
		calculateAbstractWordCount();

		return () => {
			window.removeEventListener('resize', updateHeaders);
		};
	});

	async function fetchLastUpdatedTime() {
		const username = 'yt-dlp';
		const repo = 'yt-dlp';
		const url = `https://api.github.com/repos/${username}/${repo}/commits`;

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Accept: 'application/vnd.github.v3+json'
				}
			});

			if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);

			const commits = await response.json();
			if (commits.length > 0) {
				const lastCommitDate = new Date(commits[0].commit.committer.date).toLocaleString();
				lastUpdated = `Last updated: ${lastCommitDate}`;
			} else {
				lastUpdated = 'No commits found.';
			}
		} catch (error) {
			console.error('Error fetching the last updated time:', error);
			lastUpdated = 'Error fetching update time.';
		}
	}

	function updateHeaders() {
		headers = Array.from(document.querySelectorAll('h2')).map((h2) => {
			const id = h2.id || generateId(h2.textContent);
			if (!h2.id) h2.id = id; // Ensure the header has an ID
			return { id, text: h2.textContent };
		});
	}

	function generateId(text) {
		return text
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '');
	}

	function scrollToSection(id) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} else {
			console.error(`Element with ID "${id}" not found.`);
		}
	}

	function addReference(text, url = null) {
		// Check if reference already exists
		if (referenceMap.has(text)) {
			return referenceMap.get(text); // Return existing index
		}

		const index = references.length + 1;
		references = [...references, { text, url }];

		// Sort references alphabetically by text
		references.sort((a, b) => a.text.localeCompare(b.text));

		// Rebuild reference map with new sorted indices
		referenceMap.clear();
		references.forEach((ref, idx) => {
			referenceMap.set(ref.text, idx + 1);
		});

		return referenceMap.get(text);
	}
	function highlightReference(index) {
		const refElement = document.getElementById(`ref-${index}`);
		if (refElement) {
			document.querySelectorAll('.reference-text').forEach((el) => {
				el.classList.remove('highlight-reference');
			});

			refElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

			const textElement = refElement.querySelector('.reference-text');
			if (textElement) {
				void textElement.offsetWidth;
				textElement.classList.add('highlight-reference');
			}
		}
	}
</script>

<div id="main">
	<div id="content">
		<h1>
			The Science of Headphone Sound: Understanding Frequency Response and Consumer Audio Quality
		</h1>

		<h2>Introduction</h2>
		<div id="abstract">
			<p id="abstractcontents">
				The headphone market has exploded in the last few years, with a wide variety of options and
				a large portion of consumers willing to spend extra money for a good pair. Features such as
				wireless connectivity and active noise cancelling have increased their integrity in society.
				However, many consumers seem to be unaware of what makes a headphone sound good. This
				article explores the science of frequency responses, what makes the “ideal” sound, and how
				the consumer headphone market deviates from established standards.
			</p>
		</div>

		<h2>Understanding “Neutral” Frequency Response</h2>
		<p>
			Frequency response is determined by placing the headphone on a head and torso simulator (HATS)
			and measuring the amplitude of every frequency played. This is plotted on a graph and compared
			against targets such as Diffuse Field, which simulates the conditions of an ideal room to
			determine how sound travels within the room (<a
				href="#ref-{addReference(
					'Silver, G. (2024a) Diffuse Field: Calculate, Characterize, Calibrate, Headphones.com. Available at: https://headphones.com/blogs/features/diffuse-field (Accessed: 1 November 2024).',
					'https://headphones.com/blogs/features/diffuse-field'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Silver, G. (2024a) Diffuse Field: Calculate, Characterize, Calibrate, Headphones.com. Available at: https://headphones.com/blogs/features/diffuse-field (Accessed: 1 November 2024).'
						),
						'https://headphones.com/blogs/features/diffuse-field'
					)}
			>
				Silver, 2024a</a
			>) This allows for headphones to easily be compared to each other (<a
				href="#ref-{addReference(
					'Olive, S. (2022) The Perception and Measurement of Headphone Sound Quality: What Do Listeners Prefer?. Acoustics Today, 18(1), pp. 1–10. Available at: https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf (Accessed: 1 November 2024).',
					'https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Olive, S. (2022) The Perception and Measurement of Headphone Sound Quality: What Do Listeners Prefer?. Acoustics Today, 18(1), pp. 1–10. Available at: https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf (Accessed: 1 November 2024).'
						),
						'https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf'
					)}
			>
				Olive, 2022</a
			>). The hearing range can be split into three main categories: Bass, Mid-range, and Treble (<a
				href="#ref-{addReference(
					'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).',
					'https://www.rtings.com/headphones/learn/sound-quality-glossary'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).'
						),
						'https://www.rtings.com/headphones/learn/sound-quality-glossary'
					)}
			>
				McCuaig, 2023</a
			>;
			<a
				href="#ref-{addReference(
					'Olive, S. (2022) The Perception and Measurement of Headphone Sound Quality: What Do Listeners Prefer?. Acoustics Today, 18(1), pp. 1–10. Available at: https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf (Accessed: 1 November 2024).',
					'https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Olive, S. (2022) The Perception and Measurement of Headphone Sound Quality: What Do Listeners Prefer?. Acoustics Today, 18(1), pp. 1–10. Available at: https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf (Accessed: 1 November 2024).'
						),
						'https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf'
					)}
			>
				Olive, 2022</a
			>). A neutral sound profile is one where all frequencies sound equally balanced, as it is
			intended to be heard by audio engineers (<a
				href="#ref-{addReference(
					'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).',
					'https://www.rtings.com/headphones/learn/sound-quality-glossary'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).'
						),
						'https://www.rtings.com/headphones/learn/sound-quality-glossary'
					)}
			>
				McCuaig, 2023</a
			>). Due to how sound interacts with our anatomy, a neutral sound is highly individual. This is
			referred to as a head-related transfer function (HRTF); everyone has a different HRTF (<a
				href="#ref-{addReference(
					'Silver, G. (2024a) Diffuse Field: Calculate, Characterize, Calibrate. Headphones.com. Available at: https://headphones.com/blogs/features/diffuse-field (Accessed: 1 November 2024).',
					'https://headphones.com/blogs/features/diffuse-field'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Silver, G. (2024a) Diffuse Field: Calculate, Characterize, Calibrate. Headphones.com. Available at: https://headphones.com/blogs/features/diffuse-field (Accessed: 1 November 2024).'
						),
						'https://headphones.com/blogs/features/diffuse-field'
					)}
			>
				Silver, 2024a</a
			>).
		</p>

		<h2>Target Curves</h2>
		<p>
			Many tests have been conducted to determine what most consumers would consider to be the
			“ideal” sound. Averages of these tests have been plotted to determine a target frequency
			response, known as a target curve. Most research for over-ear headphones has been conducted
			for Harman by Dr. Sean Olive and is recognised as the “Harman target,” with many iterations
			since its first introduction in 2013 (<a
				href="#ref-{addReference(
					'Silver, G. (2024a) Diffuse Field: Calculate, Characterize, Calibrate. Headphones.com. Available at: https://headphones.com/blogs/features/diffuse-field (Accessed: 1 November 2024).',
					'https://headphones.com/blogs/features/diffuse-field'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Silver, G. (2024a) Diffuse Field: Calculate, Characterize, Calibrate. Headphones.com. Available at: https://headphones.com/blogs/features/diffuse-field (Accessed: 1 November 2024).'
						),
						'https://headphones.com/blogs/features/diffuse-field'
					)}
			>
				Silver, 2024a</a
			>).
		</p>
		<p>
			Tests are primarily conducted using two methods: allowing test participants to try multiple
			headphones with different sound profiles or allowing them to alter the sound in an app and
			rating the sound, with a higher number being better (<a
				href="#ref-{addReference(
					'Olive, S., Welti, T. and Khonsaripour, O. (2017) The Perception and Measurement of Headphones. Listen Inc. Available at: https://www.listeninc.com/wp/media/Perception_and_-Measurement_of_Headphones_Sean_Olive.pdf (Accessed: 1 November 2024).',
					'https://www.listeninc.com/wp/media/Perception_and_-Measurement_of_Headphones_Sean_Olive.pdf'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Olive, S., Welti, T. and Khonsaripour, O. (2017) The Perception and Measurement of Headphones. Listen Inc. Available at: https://www.listeninc.com/wp/media/Perception_and_-Measurement_of_Headphones_Sean_Olive.pdf (Accessed: 1 November 2024).'
						),
						'https://www.listeninc.com/wp/media/Perception_and_-Measurement_of_Headphones_Sean_Olive.pdf'
					)}
			>
				Olive et al., 2017</a
			>).
		</p>

		<h2>Sound Signatures</h2>
		<p>
			Many consumers find neutral sound boring and prefer a coloured sound deviating from the audio
			engineer’s intentions. Common sound signatures are bass-heavy, V-shaped, and treble-heavy (<a
				href="#ref-{addReference(
					'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).',
					'https://www.rtings.com/headphones/learn/sound-quality-glossary'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).'
						),
						'https://www.rtings.com/headphones/learn/sound-quality-glossary'
					)}
			>
				McCuaig, 2023</a
			>). A bass-heavy sound has significantly boosted bass, resulting in a thumpy, boomy sound at
			the expense of clarity if the boost extends into the mid-range, referred to as sounding “warm”
			(<a
				href="#ref-{addReference(
					'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).',
					'https://www.rtings.com/headphones/learn/sound-quality-glossary'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).'
						),
						'https://www.rtings.com/headphones/learn/sound-quality-glossary'
					)}
			>
				McCuaig, 2023</a
			>). A V-shaped sound signature is one where both the bass and treble are boosted, resulting in
			a “V-shaped” graph. This results in an exciting sound where you still get extra thump and
			rumble without the qualities of treble being lost in the mix, at the expense of the mid-range
			almost disappearing (<a
				href="#ref-{addReference(
					'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).',
					'https://www.rtings.com/headphones/learn/sound-quality-glossary'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).'
						),
						'https://www.rtings.com/headphones/learn/sound-quality-glossary'
					)}
			>
				McCuaig, 2023</a
			>). A treble-boosted sound enhances detail at the expense of sounding piercing and fatiguing,
			preferred by many as it reveals flaws in music and compensates for age-related hearing loss (<a
				href="#ref-{addReference(
					'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).',
					'https://www.rtings.com/headphones/learn/sound-quality-glossary'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'McCuaig, V. (2023) Sound Quality Glossary for Headphones. Rtings.com. Available at: https://www.rtings.com/headphones/learn/sound-quality-glossary (Accessed: 1 November 2024).'
						),
						'https://www.rtings.com/headphones/learn/sound-quality-glossary'
					)}
			>
				McCuaig, 2023</a
			>;
			<a
				href="#ref-{addReference(
					'Olive, S. (2022) The Perception and Measurement of Headphone Sound Quality: What Do Listeners Prefer?. Acoustics Today, 18(1), pp. 1–10. Available at: https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf (Accessed: 1 November 2024).',
					'https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Olive, S. (2022) The Perception and Measurement of Headphone Sound Quality: What Do Listeners Prefer?. Acoustics Today, 18(1), pp. 1–10. Available at: https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf (Accessed: 1 November 2024).'
						),
						'https://acousticstoday.org/wp-content/uploads/2022/03/The-Perception-and-Measurement-of-Headphone-Sound-Quality-What-Do-Listeners-Prefer-Sean-E.-Olive.pdf'
					)}
			>
				Olive, 2022</a
			>). This type of sound is known as being “bright.”
		</p>

		<h2>Why Frequency Response Graphs Aren’t Flat</h2>

		<p>
			Almost all charts will have a bump in the treble region, referred to as “ear gain.” This
			represents the region of frequencies that are naturally amplified by the pinna, so that higher
			frequency sounds, such as speech, can be better understood (<a
				href="#ref-{addReference(
					'Headphones.com (2022) Measurements and Frequency Response - How to read headphone graphs. Available at: https://headphones.com/pages/measurements-and-frequency-response (Accessed: 1 November 2024).',
					'https://headphones.com/pages/measurements-and-frequency-response'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Headphones.com (2022) Measurements and Frequency Response - How to read headphone graphs. Available at: https://headphones.com/pages/measurements-and-frequency-response (Accessed: 1 November 2024).'
						),
						'https://headphones.com/pages/measurements-and-frequency-response'
					)}
			>
				Headphones.com, 2022</a
			>).
		</p>

		<h2>Evaluating the current state of the headphone market</h2>
		<p>
			Table 1 consists of the most popular over-ear headphones based on a list of the most popular
			headphone brands in the US and their flagship consumer headphone (<a
				href="#ref-{addReference(
					'Bashir, U. (2024) Most Popular Headphone Brands in the United States. Statista. Available at: https://www.statista.com/forecasts/997153/most-used-headphones-by-brand-in-the-us (Accessed: 1 November 2024).',
					'https://www.statista.com/forecasts/997153/most-used-headphones-by-brand-in-the-us'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Bashir, U. (2024) Most Popular Headphone Brands in the United States. Statista. Available at: https://www.statista.com/forecasts/997153/most-used-headphones-by-brand-in-the-us (Accessed: 1 November 2024).'
						),
						'https://www.statista.com/forecasts/997153/most-used-headphones-by-brand-in-the-us'
					)}
			>
				Bashir, 2024</a
			>). This was done as sales data on specific models is scarce.
		</p>

		<div class="headphone-table">
			<h3>Table 1: List of popular Headphones</h3>
			<table>
				<thead>
					<tr>
						<th>Brand</th>
						<th>Model</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Apple</td>
						<td>AirPods Max</td>
					</tr>
					<tr>
						<td>Beats</td>
						<td>Solo 4</td>
					</tr>
					<tr>
						<td>Sony</td>
						<td>WH-1000XM5</td>
					</tr>
					<tr>
						<td>JBL</td>
						<td>Tour One M2</td>
					</tr>
					<tr>
						<td>Bose</td>
						<td>QC Ultra</td>
					</tr>
				</tbody>
			</table>
		</div>

		<ImageWithCaption
			src={figure1}
			alt="Figure 1"
			caption="Figure 1: FR Charts for popular headphones"
		/>

		<p>
			Figure 1 presents a comparison chart from the community run database squig.link. As each
			contributor uses different measuring gear, results from different people are not comparable.
			The contributor has not stated which HATS is used, though they have measured 4/5 of the
			headphones listed. The Beats Solo 4 has not been measured by anyone at the time of writing.
		</p>

		<p>
			These headphones feature a V-shaped sound signature, with Bose having the most significant
			bass boost. On their own, these measurements don't reveal much about their sound compared to a
			neutral reference. Due to limitations, I will compare the Sony WH-1000XM5 to the Sennheiser HD
			600, renowned for its neutral tuning and sub-bass roll-off, which closely follows the Harman
			2018 linear target.
		</p>
		<ImageWithCaption src={figure2} alt="Figure 2" caption="Figure 2: XM5 vs HD 600" />

		<ImageWithCaption
			src={figure3}
			alt="Figure 3"
			caption="Figure 3: HD 600 vs Harman OE 2018 Linear"
		/>

		<p>
			As seen in Figure 2 & 3, the XM5 has a notable bass boost while having a recessed mid-range
			but similar treble to the HD 600. This results in a sound that is boomy, bloated, and lacking
			in clarity. The recession in the mid-range is done to create a sense of space in the
			headphone; however, this comes at the expense of vocal clarity (<a
				href="#ref-{addReference(
					'Silver, G. (2024b) Sennheiser HD 490 Pro: Incrementalist. Headphones.com. Available at: https://headphones.com/blogs/reviews/sennheiser-hd-490-pro-incrementalist (Accessed: 1 November 2024).',
					'https://headphones.com/blogs/reviews/sennheiser-hd-490-pro-incrementalist'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Silver, G. (2024b) Sennheiser HD 490 Pro: Incrementalist. Headphones.com. Available at: https://headphones.com/blogs/reviews/sennheiser-hd-490-pro-incrementalist (Accessed: 1 November 2024).'
						),
						'https://headphones.com/blogs/reviews/sennheiser-hd-490-pro-incrementalist'
					)}
			>
				Silver, 2024b</a
			>).
		</p>

		<p>
			Given this information, we can assume that the other headphones are simply different amounts
			of the same problem, and we can conclude that most consumer headphones are significantly bass
			boosted. However, this directly contradicts the research done by Harman and Dr Sean Olive to
			determine consumer preference.
		</p>

		<ImageWithCaption
			src={figure4}
			alt="Figure 4"
			caption="Figure 4: Airpods Max vs Harman OE 2018"
		/>

		<p>
			The least bass boosted headphone in the table, the Airpods Max, still exceeds the target and
			the treble is significantly reduced.
		</p>

		<p>
			Many companies prefer this tuning style as it sounds less fatiguing due to fewer perceivable
			details. Another reason is Dr. Dre's promotion of bass as the main headphone quality. Beats'
			success stems from cheap earphones lacking bass, leading consumers to associate bass with
			higher quality (<a
				href="#ref-{addReference(
					'Izundu, C.C. (2014) Beats by Dre president defends headphone bass quality. BBC News. Available at: https://www.bbc.co.uk/news/newsbeat-28287697 (Accessed: 1 November 2024).',
					'https://www.bbc.co.uk/news/newsbeat-28287697'
				)}"
				class="reference-link"
				on:click|preventDefault={() =>
					highlightReference(
						addReference(
							'Izundu, C.C. (2014) Beats by Dre president defends headphone bass quality. BBC News. Available at: https://www.bbc.co.uk/news/newsbeat-28287697 (Accessed: 1 November 2024).'
						),
						'https://www.bbc.co.uk/news/newsbeat-28287697'
					)}
			>
				Izundu, 2014</a
			>).
		</p>

		<h2>Conclusion</h2>
		<p>
			There is a disconnect between scientific research and the actual tuning of consumer
			headphones. Research suggests that most listeners will prefer a neutral or slightly v shaped
			sound when given the choice; the market still seems to be dominated by bass boosted sound
			signatures. This results in more consumers associating excessive bass with audio quality and
			allows manufacturers to make clarity improvements every year by slightly reducing the boost –
			making consumers waste money on new headphones.
		</p>
		<p>
			As the headphone market continues to evolve, manufacturers may eventually lean towards more
			scientifically correct tunings. Until then, consumers seeking accurate sound will have to cope
			with audiophile/HiFi offerings.
		</p>

		<div id="ppt">
			<h2>Presentation</h2>
			<video src={presentation} controls></video>
		</div>

		<div class="reference-list">
			<h2>References</h2>
			<ul>
				{#each references as ref, index}
					<li id="ref-{index + 1}" class="reference-item">
						{#if ref.url}
							<a href={ref.url} target="_blank" rel="noopener noreferrer" class="reference-text"
								>{ref.text}</a
							>
						{:else}
							<span class="reference-text">{ref.text}</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div id="abstract-word-counter">
		📄 Abstract: {abstractwords} Words
	</div>

	<div id="floating-word-counter">
		📝 Word Count: {wordCount} Words
	</div>

	<div id="floating-button" on:click={() => alert(lastUpdated)}>🕒 Last Updated</div>

	{#if tooltipVisible}
		<div id="last-updated-tooltip">{lastUpdated}</div>
	{/if}

	<nav id="nav">
		<h3>Table of Contents</h3>
		<ul>
			{#each headers as header}
				<li>
					<a href="#{header.id}" on:click|preventDefault={() => scrollToSection(header.id)}>
						{header.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>

<footer id="footer">
	<img src={Banner} id="banner" alt="Website Banner" />
</footer>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

	:global(body) {
		font-family: 'Inter', sans-serif;
		line-height: 1.6;
		color: #333;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		background-color: #fcfdfd;
	}

	:global(.highlight-reference) {
		animation: highlightFade 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		border-radius: 6px;
		position: relative;
	}

	@keyframes highlightFade {
		0% {
			background-color: rgba(37, 56, 74, 0);
			transform: scale(1);
		}
		15% {
			background-color: rgba(37, 56, 74, 0.1);
			transform: scale(1.02);
		}
		30% {
			background-color: rgba(37, 56, 74, 0.15);
			transform: scale(1);
		}
		100% {
			background-color: rgba(37, 56, 74, 0);
			transform: scale(1);
		}
	}

	#main {
		display: flex;
		gap: 40px;
	}

	#content {
		flex: 1;
	}

	#nav {
		position: sticky;
		top: 20px;
		align-self: start;
		width: 220px;
		background: #f0f4f8;
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 4px 20px rgba(37, 56, 74, 0.08);
		border: 1px solid rgba(37, 56, 74, 0.1);
		transition: all 0.3s ease;
	}

	#nav:hover {
		box-shadow: 0 6px 24px rgba(37, 56, 74, 0.12);
		transform: translateY(-2px);
	}

	#nav h3 {
		margin-top: 0;
		color: #2c3e50;
		font-weight: 600;
		font-size: 1.2em;
		margin-bottom: 16px;
		padding-bottom: 8px;
		border-bottom: 2px solid rgba(44, 62, 80, 0.1);
	}

	#nav ul {
		list-style-type: none;
		padding: 0;
	}

	#nav li {
		margin-bottom: 12px;
	}

	#nav a {
		color: #34495e;
		text-decoration: none;
		transition: all 0.3s ease;
		display: block;
		padding: 8px 12px;
		border-radius: 6px;
		font-weight: 500;
	}

	#nav a:hover {
		background-color: rgba(52, 73, 94, 0.08);
		transform: translateX(4px);
	}

	#footer {
		margin-top: 40px;
		padding-top: 20px;
		border-top: 1px solid rgba(37, 56, 74, 0.1);
		text-align: center;
	}

	#banner {
		width: 30%;
		height: auto;
	}

	.reference-list {
		margin-top: 40px;
		border-top: 1px solid rgba(37, 56, 74, 0.1);
		padding-top: 20px;
	}

	.reference-list ul {
		list-style-type: disc;
		padding-left: 20px;
		margin: 0;
	}

	.reference-item {
		display: list-item;
		padding: 0.5rem 0;
		margin: 0.5rem 0;
		transition: background-color 0.3s ease;
		border-radius: 6px;
	}

	.reference-item:hover {
		background-color: rgba(37, 56, 74, 0.03);
	}

	.reference-link {
		cursor: pointer;
		color: #007bff;
		text-decoration: none;
	}

	.reference-link:hover {
		text-decoration: underline;
	}

	.reference-text {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		margin: -0.25rem 0;
		line-height: 1.6;
	}

	#floating-button,
	#floating-word-counter,
	#abstract-word-counter {
		position: fixed;
		right: 20px;
		background-color: #e8eaed;
		color: #333;
		padding: 12px 16px;
		border-radius: 50px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		font-size: 14px;
		font-weight: bold;
		cursor: pointer;
		z-index: 1000;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	#floating-button {
		bottom: 20px;
	}

	#floating-word-counter {
		bottom: calc(20px + 4rem);
	}

	#abstract-word-counter {
		bottom: calc(20px + 8rem);
	}

	#floating-button:hover {
		background-color: #d6dadd;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
	}

	#last-updated-tooltip {
		position: fixed;
		bottom: 8%;
		right: 20px;
		background-color: rgba(50, 50, 50, 0.9);
		color: white;
		padding: 8px 12px;
		border-radius: 6px;
		font-size: 12px;
		z-index: 1000;
		white-space: nowrap;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.headphone-table {
		margin: 20px 0;
		border-collapse: collapse;
		width: 50%;
	}

	.headphone-table table {
		width: 50%;
		border: 1px solid #ddd;
	}

	.headphone-table th,
	.headphone-table td {
		text-align: left;
		padding: 12px;
		border-bottom: 1px solid #ddd;
	}

	.headphone-table th {
		background-color: #f6f9ff;
	}

	.headphone-table tbody tr:hover {
		background-color: rgba(165, 168, 171, 0.1);
	}

	#word-count {
		margin-top: 20px;
		padding: 10px;
		color: #333;
		font-weight: bold;
		text-align: center;
	}
	.reference-list a {
		color: inherit;
		text-decoration: none;
	}

	.reference-list a:hover {
		text-decoration: none; 
	}


	#ppt video {
		max-width: 100%;
		max-height: 80vh;
		object-fit: contain;
		border-radius: 12px;
	}
</style>
