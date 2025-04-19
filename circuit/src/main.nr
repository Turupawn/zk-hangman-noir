use dep::std;

fn main(
    word: [Field; 10],
    word_length: pub Field,
    winner: pub Field
) -> pub Field {
    let mut word_bytes = [0; 10];
    
    for i in 0..10 {
        if i < word_length as u8 {
            let current_char = word[i] as u8;
            let is_uppercase = (current_char >= 65) & (current_char <= 90);
            let is_lowercase = (current_char >= 97) & (current_char <= 122);
            assert(is_uppercase | is_lowercase);
        }
        word_bytes[i] = word[i] as u8;
    }
    
    
    let hash_bytes = std::hash::keccak256(word_bytes, 10);

    let mut computed_hash = 0 as Field;
    for i in 0..30 {
        computed_hash = computed_hash * 256 + (hash_bytes[i] as Field);
    }

    println(computed_hash);
    println(hash_bytes);
    computed_hash
}