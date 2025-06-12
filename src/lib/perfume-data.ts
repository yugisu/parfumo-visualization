import perfumeCsv from '../assets/processed_parfumo_data.csv';
import _notesToCategoryAndColor from '../assets/notes_to_note_details.json';
import _perfumeCategories from '../assets/perfume_notes_categories.json';

const notesToCategoryAndColor = _notesToCategoryAndColor as Record<string, { category: string; color?: string }>;
const perfumeCategories = _perfumeCategories as Record<string, { color: string; notes: string[] }>;

export type Perfume = {
	Name: string;
	Brand: string;

	Main_Accords?: string[];
	Base_Notes?: string[];
	Middle_Notes?: string[];
	Top_Notes?: string[];

	Number?: string;
	Release_Year?: string;
	Concentration?: string;
	Rating_Value?: string;
	Rating_Count?: string;
	Perfumers?: string;
	URL?: string;
};

const notesFields = ['Main_Accords', 'Base_Notes', 'Middle_Notes', 'Top_Notes'];

export const getPerfumeData = () => {
	const perfumeData = perfumeCsv
		// Convert NA to undefined.
		.map((d) => Object.fromEntries(Object.entries(d).map(([k, value]) => [k, value === 'NA' ? undefined : value])))
		// FIXME: Filter out perfumes without Main_Accords data
		.filter((d) => d['Main_Accords'])
		// Convert string notes fields into an array of strings.
		.map((d) => {
			notesFields.forEach((nf) => {
				d[nf] = d[nf] ? (d[nf]?.split(/,\s?/) as any) : undefined;
			});

			return d as unknown as Perfume;
		});

	return perfumeData;
};

export const getNoteDetails = (note: string, colorBasedOnCategory?: boolean): { category: string; color: string } => {
	const res = notesToCategoryAndColor[note.toLowerCase()];

	if (!res) {
		console.warn(`Failed to find details for a note ${note}. Resorting to "Other"`);

		return {
			category: 'Other',
			color: '#95A5A6',
		};
	}

	if (!res.color || colorBasedOnCategory) {
		return {
			category: res.category,
			color: perfumeCategories[res.category].color,
		};
	}

	return res;
};
