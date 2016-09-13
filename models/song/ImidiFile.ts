//It happens oftentimes that different midi versions can be obtained
//of a song. The idea is to be able to save different versions and
//identify them with an MD hash. So we can save as many versions of a
//song as we want, but it would be stupid to save identical versions
//So we ensure we don't save the same version twice by comparing the 
//hashes. The quality is a value that goes from 0 to 100 and if present
//can allow us to select the best version of the song
//With midi files downloaded from the web, sometimes some versions are
//very bad and they don't resemble much the original song

interface ImidiFile {
    midiBytes: Buffer,
    hash: Buffer,
    quality: Number,
    length: Number
};

export = ImidiFile;