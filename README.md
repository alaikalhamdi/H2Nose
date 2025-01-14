# H2Nose

## Overview
H2Nose is a tool used to check the Gasifier's effectiveness in producing Syngas from biomass pellets. This repository is mainly for the UI of H2nose. For the C++ library for H2Nose, refer to this [H2NoseLib3](https://github.com/ivanaprianto/H2NoseLib3) library, which is used for the arduino in H2Nose.

This is the simplified, easier-to-navigate, better, cooler version of [H2E Visual](https://github.com/alaikalhamdi/H2E_Visual). It's practically a remake, because I barely copied anything from the old UI. I don't know if this will make any differences but I did this for better documentation, easier development and it's definitely going to be easier now than that old messy piece of junk.

## Features
- H2Nose can monitor these gases in realtime:
    - Hydrogen (H2)
    - Carbon Dioxide (CO2)
    - Carbon Monoxide (CO)
    - Methane (CH4)
    - Benzene (C6H6)
    - Propane (C3H8)
    - Alcohol (OH)
    - Liquefied petroleum gas (LPG)
- H2Nose can also monitor Temperature and Humidity in realtime
- H2Nose can record gas data, up to 3 minutes
- Recorded gas data is saved as JSON file, which can be opened using the H2Nose UI
- Dark Mode (for lower power consumption)

## Installation / Usage
This app should be run in H2Nose, because this is literally built for it. But if you want to try, please follow the following steps:
1. Clone the repository:
    ```sh
    git clone https://github.com/alaikalhamdi/H2Nose.git
    ```
2. Navigate to the project directory:
    ```sh
    cd H2Nose
    ```
3. Install the required dependencies 
    ```sh
    python -m pip install -r requirements.txt
    ```
4. Run the `server.py` file
    ```sh
    python ./server.py
    ```
5. Open `index.html` using any browser you like. 
6. Press the `Ctrl + Shift + I` combination to open your browser's developer tools. 
7. Toggle the **Device Emulation** by pressing `Ctrl + Shift + M` combination. 
8. In the dimensions menu, change the dimension to **720 x 1280**. This is H2Nose native resolution.

If you have done this once, just do step 4 and 5 again if you wish to try it again later on.

## Contributing
Hello! If you are H2Nose's next developer after us, or if you're me in the future who has forgotten anything, I have left some notes in this Notion page, check it out!

We welcome contributions to H2Nose! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m "Description of changes"
    ```
4. Push to the branch:
    ```sh
    git push origin feature-branch
    ```
5. Create a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or inquiries, please contact me at alaikal.edu@gmail.com.
