from pathlib import Path
from pprint import pprint
import shutil
import re
import json


ranks_map = {"page": 11, "knight": 12, "queen": 13, "king": 14, "ace": 1}

out_dir = Path("./renamed/")


def proc_minor():
    for d in Path("./cards/").glob("minor_arcana*.png"):
        parts = d.stem.split("_")[2:]
        suit = parts[0]

        rank = ranks_map.get(parts[1])

        if rank is None:
            rank = int(parts[1])

        shutil.copy(d, f"./renamed/{suit}_{rank:>02}.png")


ordering = [
    "fool",
    "magician",
    "priestess",
    "empress",
    "emperor",
    "hierophant",
    "lovers",
    "chariot",
    "strength",
    "hermit",
    "fortune",
    "justice",
    "hanged",
    "death",
    "temperance",
    "devil",
    "tower",
    "star",
    "moon",
    "sun",
    "judgement",
    "world",
]


def proc_major():
    assert len(ordering) == 22

    for d in Path("./cards/").glob("major_arcana*.png"):
        card_name = d.stem.split("_")[-1]
        number = ordering.index(card_name)

        shutil.copy(d, f"./renamed/major_{number:>02}_{card_name}.png")


def main():
    with open("./cards.json", "r") as fp:
        card_data = json.load(fp)

    major_data = card_data["major"]
    minor_data = card_data["minor"]

    amended_minor = [
        {**m, **{"image": f"{m['suit']}_{int(m['rank']):>02}.png"}} for m in minor_data
    ]

    amended_major = [
        {
            **m,
            **{
                "rank": i,
                "suit": "major",
                "normName": re.sub("The", "", m["title"]).split()[0].lower(),
            },
        }
        for i, m in enumerate(major_data)
    ]

    assert len(major_data) == 22
    pprint(amended_major)

    with open("./cards_v2.json", "w") as fp:
        json.dump({"major" : amended_major, "minor" : amended_minor}, fp, indent=4)


if __name__ == "__main__":
    main()
