from __future__ import annotations

import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "build_frames/lineup_unique_art2/frames_1080p_jpg"
OUTPUT_DIR = ROOT / "build_frames/lineup_unique_art2/named_frames_1080p_jpg"
MANIFEST_JSON = OUTPUT_DIR / "named_frames_manifest.json"
MANIFEST_TSV = OUTPUT_DIR / "named_frames_manifest.tsv"


FRAME_NAMES = [
    (1, "mountain_sage_long_road", "Mountain Sage Long Road", "Solitary robed elder walking through stormy mountain pass."),
    (2, "sage_blowing_shankh", "Sage Blowing Shankh", "Elder raises conch shell and blows toward the mountains."),
    (3, "haryanvi_warrior_urban_delivery", "Haryanvi Warrior Urban Delivery", "Muscular performer in ruined city, direct camera delivery."),
    (4, "rubab_hands_closeup", "Rubab Hands Closeup", "Close hands playing a blood-streaked string instrument."),
    (5, "mountain_warrior_march", "Mountain Warrior March", "Armed group walking forward through mountain valley."),
    (6, "blood_granth_reader", "Blood Granth Reader", "Turbaned artist reading a blood-marked manuscript in library."),
    (7, "ganga_diyas_tulsi_wide", "Ganga Diyas Tulsi Wide", "Calm river with floating diyas and tulsi plant."),
    (8, "unity_handshake_firelight", "Unity Handshake Firelight", "Two men clasp hands in warm firelight."),
    (9, "total_eclipse_halo", "Total Eclipse Halo", "Black solar eclipse with bright ring of light."),
    (10, "city_overlook_raised_hand", "City Overlook Raised Hand", "Figure looks over modern skyline with raised hand."),
    (11, "elder_chant_face", "Elder Chant Face", "Close elder face with eyes closed, chanting."),
    (12, "ritual_bell_vibration", "Ritual Bell Vibration", "Bell suspended in darkness with vibration rings."),
    (13, "ney_flute_elder_mountains", "Ney Flute Elder Mountains", "Elder playing flute against mountain landscape."),
    (14, "split_flute_mountain_notes", "Split Flute Mountain Notes", "Split composition of flute, hair, mountains, and notes."),
    (15, "wind_cloak_mountain_sage", "Wind Cloak Mountain Sage", "Robed elder in wind, mountains behind."),
    (16, "ney_flute_mouth_closeup", "Ney Flute Mouth Closeup", "Close-up of flute at bearded mouth with musical notes."),
    (17, "abstract_shadow_cut", "Abstract Shadow Cut", "High-contrast abstract diagonal shadow transition."),
    (18, "swirling_musical_wind", "Swirling Musical Wind", "Sepia wind ribbons carrying musical notes."),
    (19, "red_notes_mountain_wind", "Red Notes Mountain Wind", "Red musical notes over mountain wind ribbons."),
    (20, "dark_music_notes", "Dark Music Notes", "Sparse red music notes on black field."),
    (21, "flute_silhouette_closeup", "Flute Silhouette Closeup", "Dark close-up of fingers on flute."),
    (22, "mountain_music_ribbons", "Mountain Music Ribbons", "Mountain valley crossed by flowing musical ribbons."),
    (23, "cloak_mountain_music_ribbons", "Cloak Mountain Music Ribbons", "Cloaked figure and music ribbons through mountain pass."),
    (24, "intro_ney_closed_eyes", "Intro Ney Closed Eyes", "Elder closed-eyed portrait with intro flute caption."),
    (25, "shankh_on_pedestal", "Shankh On Pedestal", "Conch shell resting on plinth under storm clouds."),
    (26, "sage_shankh_mountain_blast", "Sage Shankh Mountain Blast", "Elder blows conch shell in mountain setting."),
    (27, "shankh_hands_detail", "Shankh Hands Detail", "Hands and mouth on decorated conch shell."),
    (28, "sage_clutching_robes", "Sage Clutching Robes", "Frontal elder gripping his robe before blast."),
    (29, "shankh_mouth_detail", "Shankh Mouth Detail", "Extreme close-up of lips and fingers on conch."),
    (30, "red_resonance_spiral", "Red Resonance Spiral", "Red and cream sonic spiral vortex."),
    (31, "deep_red_resonance_spiral", "Deep Red Resonance Spiral", "Darker red circular sonic spiral."),
    (32, "shankh_red_sonic_beam", "Shankh Red Sonic Beam", "Conch releases red beam from elder's mouth."),
    (33, "mountain_dust_fracture", "Mountain Dust Fracture", "Rock face erupts with dust in mountain valley."),
    (34, "shankh_side_red_blast", "Shankh Side Red Blast", "Side angle of conch red blast."),
    (35, "smoking_shankh_still", "Smoking Shankh Still", "Conch shell sits in darkness with red smoke."),
    (36, "collapsing_buildings_mountain", "Collapsing Buildings Mountain", "Modern buildings fall into ancient mountain scene."),
    (37, "haryanvi_stance_ruins", "Haryanvi Stance Ruins", "Muscular haryanvi character stands in concrete ruins."),
    (38, "aggressive_delivery_caption", "Aggressive Delivery Caption", "Close mouth and beard with Hindi speech caption."),
    (39, "haryanvi_hand_gesture_ruins", "Haryanvi Hand Gesture Ruins", "Performer gestures in ruined street."),
    (40, "low_crouch_ground_impact", "Low Crouch Ground Impact", "Low angle body crouch near cracked ground."),
    (41, "haryanvi_waveform_portrait", "Haryanvi Waveform Portrait", "Intense portrait against red audio waveform."),
    (42, "walking_silhouette_ruins", "Walking Silhouette Ruins", "Black silhouette walks through urban canyon."),
    (43, "foot_impact_dust_burst", "Foot Impact Dust Burst", "Boot impact throws dust and debris upward."),
    (44, "haryanvi_smirk_red_backdrop", "Haryanvi Smirk Red Backdrop", "Smirking turbaned performer on red background."),
    (45, "lone_shadow_floor", "Lone Shadow Floor", "Standing figure casts long shadows across open floor."),
    (46, "radiant_clenched_fist", "Radiant Clenched Fist", "Raised fist with radial white impact rays."),
    (47, "bloodied_fist_ground", "Bloodied Fist Ground", "Blood-streaked fist held near cracked ground."),
    (48, "footprint_audio_waveform", "Footprint Audio Waveform", "Footprint crack with red waveform behind it."),
    (49, "rubab_red_spark_pluck", "Rubab Red Spark Pluck", "Rubab strings plucked with red electric sparks."),
    (50, "muscular_haryanvi_charge", "Muscular Haryanvi Charge", "Performer leans forward with power rays behind him."),
    (51, "haryanvi_red_burst", "Haryanvi Red Burst", "Performer framed by explosive red burst lines."),
    (52, "haryanvi_echo_copies", "Haryanvi Echo Copies", "Multiple ghosted copies of performer behind leader."),
    (53, "warrior_rubab_cracked_wall", "Warrior Rubab Cracked Wall", "Warrior holds string instrument before cracked wall."),
    (54, "red_ground_explosion", "Red Ground Explosion", "Red burst explodes from cracked concrete."),
    (55, "haryanvi_group_stance", "Haryanvi Group Stance", "Group of muscular figures standing in formation."),
    (56, "elder_shocked_debris", "Elder Shocked Debris", "Elder face surrounded by flying debris."),
    (57, "elder_debris_halo", "Elder Debris Halo", "Elder portrait framed by circular debris field."),
    (58, "mountain_long_road_group", "Mountain Long Road Group", "Small group walking through distant mountain valley."),
    (59, "marching_feet_dust", "Marching Feet Dust", "Close boots marching through dusty ground."),
    (60, "weapon_belt_hands", "Weapon Belt Hands", "Hands grip belt or weapon strap at waist."),
    (61, "pakhtoon_formation_mountain", "Pakhtoon Formation Mountain", "Pakhtoon warrior formation marching in mountains."),
    (62, "pakhtoon_squad_close", "Pakhtoon Squad Close", "Close disciplined group of armed mountain warriors."),
    (63, "intense_eyes_closeup", "Intense Eyes Closeup", "Extreme close-up of fierce eyes."),
    (64, "moustache_speech_closeup", "Moustache Speech Closeup", "Mouth and moustache close-up mid-speech."),
    (65, "lone_pakhtoon_red_swirl", "Lone Pakhtoon Red Swirl", "Single warrior walks through red swirling ground."),
    (66, "warriors_on_ridge", "Warriors On Ridge", "Warriors stand across rocky ridge line."),
    (67, "hand_gripping_staff", "Hand Gripping Staff", "Close hand gripping staff or weapon shaft."),
    (68, "descending_pakhtoon_squad", "Descending Pakhtoon Squad", "Warrior squad descends mountain path."),
    (69, "pakhtoon_dialogue_caption", "Pakhtoon Dialogue Caption", "Single warrior in mountains with subtitle caption."),
    (70, "library_archway_silhouette", "Library Archway Silhouette", "Figure enters tall arched library corridor."),
    (71, "searching_shelves_locked_book", "Searching Shelves Locked Book", "Hand pulls locked book from shelf."),
    (72, "manuscript_table_writer", "Manuscript Table Writer", "Writer works over manuscript at table."),
    (73, "natyashastra_page_point", "Natyashastra Page Point", "Finger points to Natyashastra manuscript page."),
    (74, "blood_ink_pot_pen", "Blood Ink Pot Pen", "Pen dips into red blood ink pot."),
    (75, "wrist_cut_ink_mixing", "Wrist Cut Ink Mixing", "Cut wrist drips blood near ink pot."),
    (76, "writing_natya_katha", "Writing Natya Katha", "Hand writes large Hindi letters on parchment."),
    (77, "blood_writing_natyashastra", "Blood Writing Natyashastra", "Red ink writes Natyashastra text on page."),
    (78, "theatre_masks_hall", "Theatre Masks Hall", "Figure faces floating theatre masks in corridor."),
    (79, "red_blood_vortex", "Red Blood Vortex", "Swirling red liquid vortex."),
    (80, "warrior_pen_portrait", "Warrior Pen Portrait", "Warrior face holding pen near cheek."),
    (81, "red_natyashastra_granth", "Red Natyashastra Granth", "Open red manuscript book with Sanskrit text."),
    (82, "writing_lost_pages", "Writing Lost Pages", "Writer restores lost pages with pen."),
    (83, "theatre_masks_close", "Theatre Masks Close", "Closer theatre masks and performers scene."),
    (84, "blank_red_book", "Blank Red Book", "Open blank red book on table."),
    (85, "mountain_camp_assembly", "Mountain Camp Assembly", "Mountain camp with assembled fighters and flags."),
    (86, "haryanvi_leader_group", "Haryanvi Leader Group", "Leader portrait with people standing behind."),
    (87, "elder_smile_group", "Elder Smile Group", "Smiling elder with group in background."),
    (88, "handshake_close", "Handshake Close", "Close-up of two hands shaking."),
    (89, "tulsi_plant_close", "Tulsi Plant Close", "Tulsi plant against warm devotional background."),
    (90, "ganga_diyas_wide", "Ganga Diyas Wide", "Wide Ganga river view with floating lamps."),
    (91, "shared_tears_split_eyes", "Shared Tears Split Eyes", "Split-screen eyes with tears."),
    (92, "shared_meal_bowl", "Shared Meal Bowl", "Two men share food bowl across table."),
    (93, "haryanvi_seated_speaking", "Haryanvi Seated Speaking", "Seated haryanvi figure gestures while speaking."),
    (94, "spinning_dancer", "Spinning Dancer", "Dancer twirls with raised arm."),
    (95, "bharat_shadow_unity", "Bharat Shadow Unity", "Two shadows hold hands over word Bharat."),
    (96, "handshake_vibration_rings", "Handshake Vibration Rings", "Handshake with circular force rings."),
    (97, "clenched_hand_shards", "Clenched Hand Shards", "Close fist surrounded by broken shards."),
    (98, "void_floor_figure", "Void Floor Figure", "Lone figure on jagged white path in black void."),
    (99, "absolute_black_field", "Absolute Black Field", "Nearly blank black frame."),
    (100, "half_face_extreme_close", "Half Face Extreme Close", "Extreme cropped face close-up."),
    (101, "cosmic_face_front", "Cosmic Face Front", "Frontal turbaned face emerging from darkness."),
    (102, "dissolving_face_script", "Dissolving Face Script", "Portrait dissolves into Devanagari text."),
    (103, "falling_figure_void", "Falling Figure Void", "Tiny falling figure in blackness."),
    (104, "clean_eclipse_halo", "Clean Eclipse Halo", "Minimal eclipse ring without figure."),
    (105, "dissolving_cosmic_face", "Dissolving Cosmic Face", "Face fragments into textured cosmic field."),
    (106, "figure_inside_eclipse", "Figure Inside Eclipse", "Human silhouette stands inside eclipse ring."),
    (107, "brahman_smirk_close", "Brahman Smirk Close", "Extreme close-up of calm mysterious smile."),
    (108, "black_void_star_mark", "Black Void Star Mark", "Dark frame with small star-like mark."),
    (109, "bharat_group_march_caption", "Bharat Group March Caption", "Group walks toward mountains with Bharat caption."),
    (110, "marching_feet_haryanvi_echo", "Marching Feet Haryanvi Echo", "Feet marching over red ground with caption."),
    (111, "aqueduct_procession", "Aqueduct Procession", "Group procession under stone arches."),
    (112, "handshake_vibration_close", "Handshake Vibration Close", "Locked hands with vibration marks."),
    (113, "united_warriors_urban", "United Warriors Urban", "Haryanvi and Pakhtoon group in urban ruins."),
    (114, "eyes_mountain_reflection", "Eyes Mountain Reflection", "Eyes close-up with mountain forms in irises."),
    (115, "subtle_brahman_smile_face", "Subtle Brahman Smile Face", "Soft smiling face looking forward."),
    (116, "eclipse_figure_focus_caption", "Eclipse Figure Focus Caption", "Eclipse figure with focus caption text."),
    (117, "fist_vibration_circles", "Fist Vibration Circles", "Clenched fist inside red vibration rings."),
    (118, "ritual_bell_black", "Ritual Bell Black", "Ritual bell isolated on black."),
    (119, "elder_smoke_breath", "Elder Smoke Breath", "Elder exhales red smoke in darkness."),
    (120, "shanti_handshake_outro", "Shanti Handshake Outro", "Hands clasped with Om Shanti text and silhouettes."),
    (121, "fist_shattering_letters", "Fist Shattering Letters", "Raised fist breaks letter-like shards."),
    (122, "void_figure_shards", "Void Figure Shards", "Lone figure in void with black shards."),
    (123, "aqueduct_group_shadows", "Aqueduct Group Shadows", "Group under arches with long shadows."),
    (124, "outro_marching_feet", "Outro Marching Feet", "Low close-up of feet walking forward."),
    (125, "closed_eyes_bharat_map_face", "Closed Eyes Bharat Map Face", "Closed-eyed face with Bharat map motif."),
    (126, "blood_drop_on_page", "Blood Drop On Page", "Red drop splashes onto parchment."),
    (127, "bell_hindi_caption", "Bell Hindi Caption", "Bell with Hindi caption below."),
    (128, "compassionate_smile_face", "Compassionate Smile Face", "Soft face with tearful eyes and slight smile."),
    (129, "om_smoke_void", "Om Smoke Void", "Small Om glyph with rising smoke in black void."),
    (130, "elder_smoke_breath_side", "Elder Smoke Breath Side", "Elder exhales red smoke, alternate crop."),
    (131, "om_black_vortex", "Om Black Vortex", "Om glyph centered inside black circular vortex."),
    (132, "mouth_smirk_close", "Mouth Smirk Close", "Close-up of quiet smirk."),
    (133, "elder_smoke_breath_center", "Elder Smoke Breath Center", "Centered elder with red smoke exhale."),
    (134, "eclipse_shards", "Eclipse Shards", "Eclipse ring with shards breaking off."),
    (135, "small_om_dark_void", "Small Om Dark Void", "Small Om symbol in dim black field."),
    (136, "eclipse_ring_close", "Eclipse Ring Close", "Large clean eclipse ring close-up."),
    (137, "eclipse_soundwave_final", "Eclipse Soundwave Final", "Eclipse with shattered ring and waveform lines."),
]


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []

    for index, slug, title, description in FRAME_NAMES:
        old_name = f"frame_{index:04d}.jpg"
        source = SOURCE_DIR / old_name
        if not source.exists():
            raise FileNotFoundError(source)
        named_file = f"{index:04d}_{slug}.jpg"
        target = OUTPUT_DIR / named_file
        shutil.copy2(source, target)
        manifest.append(
            {
                "index": index,
                "old_file": str(source.relative_to(ROOT)),
                "new_file": str(target.relative_to(ROOT)),
                "slug": slug,
                "title": title,
                "description": description,
            }
        )

    MANIFEST_JSON.write_text(json.dumps({"frames": manifest}, indent=2), encoding="utf-8")
    headers = ["index", "old_file", "new_file", "slug", "title", "description"]
    rows = ["\t".join(headers)]
    for item in manifest:
        rows.append("\t".join(str(item[key]).replace("\t", " ") for key in headers))
    MANIFEST_TSV.write_text("\n".join(rows) + "\n", encoding="utf-8")

    print(f"Named {len(manifest)} frames into {OUTPUT_DIR}")
    print(MANIFEST_TSV.relative_to(ROOT))


if __name__ == "__main__":
    main()
