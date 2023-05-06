import { initPlasmicLoader } from '@plasmicapp/loader-nextjs/react-server-conditional';
export const PLASMIC = initPlasmicLoader({
  projects: [
    // {
    //   id: "eGHdVdcTH4tVrwFvZ9dsn2",  // ID of a project you are using
    //   token: "UV5AOzKGQEXRrXxM6S40UM6jKwZFyCLOV907uDFX48HLAwT7Od3ynCnib8tqD6XpD8fXNUZMjX4SgUnKw"  // API token for that project
    // }

    {
      id: 'j5zYgooL9NNCzrZVm3MQxL', // ID of a project you are using
      token:
        'KrKbIx5X0WI6DFXYg0uECGm9sXIvaVIy3P3PpENTupiP6MG98jCiPDM2NovADS5yKtzSi3Bj7CURHE2O9Vvmew' // API token for that project
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true
});
