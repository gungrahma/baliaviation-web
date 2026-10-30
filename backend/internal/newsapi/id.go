package newsapi

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

func newID() (string, error) {
	var bytes [16]byte
	if _, err := rand.Read(bytes[:]); err != nil {
		return "", fmt.Errorf("generate news update id: %w", err)
	}
	bytes[6] = (bytes[6] & 0x0f) | 0x40
	bytes[8] = (bytes[8] & 0x3f) | 0x80
	encoded := make([]byte, 36)
	hex.Encode(encoded[0:8], bytes[0:4])
	encoded[8] = '-'
	hex.Encode(encoded[9:13], bytes[4:6])
	encoded[13] = '-'
	hex.Encode(encoded[14:18], bytes[6:8])
	encoded[18] = '-'
	hex.Encode(encoded[19:23], bytes[8:10])
	encoded[23] = '-'
	hex.Encode(encoded[24:36], bytes[10:16])
	return string(encoded), nil
}
