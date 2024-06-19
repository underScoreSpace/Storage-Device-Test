#include <iostream>
#include <chrono>
#include <iomanip>
#include <fstream>

using namespace std;
using namespace std::chrono;


double readDataSpeed(const string&, size_t, size_t, double&);
double writeDataSpeed(const string&, size_t, size_t, double&);

int main(int argc, char* argv[]) {
    if (argc != 4) {
        cerr << "Usage: " << argv[0] << " <file_path> <data_size_in_bytes>" << endl;
        return EXIT_FAILURE;
    }

    string filePath = argv[1];
    size_t dataSize = stoull(argv[2]);
    size_t bufferSize = stoull(argv[3]);

    double writeLatency;
    double readLatency;
    double writeSpeed = writeDataSpeed(filePath, dataSize, bufferSize, writeLatency);
    double readSpeed = readDataSpeed(filePath, dataSize, bufferSize, readLatency);

    cout << fixed << setprecision(2) << writeSpeed << endl;
    cout << fixed << setprecision(2) << writeLatency << endl;
    cout << fixed << setprecision(2) << readSpeed << endl;
    cout << fixed << setprecision(2) << readLatency << endl;

    return EXIT_SUCCESS;
}

double readDataSpeed(const string& filePath, size_t dataSize, size_t bufferSize ,double& latency) {
    ifstream file(filePath, ios::binary);
    if (!file) {
        cerr << "Failed to open file for reading: " << filePath << endl;
        return 0;
    }

    char* buffer = new char[bufferSize];
    size_t bytesRead = 0;

    auto start = high_resolution_clock::now();
    while (bytesRead < dataSize && file) {
        file.read(buffer, min(bufferSize, dataSize - bytesRead));
        bytesRead += file.gcount();
    }
    auto end = high_resolution_clock::now();

    file.close();
    delete[] buffer;

    duration<double, milli> duration = end - start;
    latency = duration.count(); // Latency in milliseconds

    return bytesRead / (duration.count() / 1000.0) / (1024 * 1024);
}

double writeDataSpeed(const string& filePath, size_t dataSize, size_t bufferSize,double& latency) {
    ofstream file(filePath, ios::binary);
    if (!file) {
        cerr << "Failed to open file for writing: " << filePath << endl;
        return 0;
    }

    char* buffer = new char[bufferSize];
    size_t bytesWritten = 0;

    auto start = high_resolution_clock::now();
    while (bytesWritten < dataSize) {
        size_t toWrite = min(bufferSize, dataSize - bytesWritten);
        file.write(buffer, toWrite);
        bytesWritten += toWrite;
    }
    auto end = high_resolution_clock::now();

    file.close();
    delete[] buffer;

    duration<double, milli> duration = end - start;
    latency = duration.count(); // Latency in milliseconds

    return bytesWritten / (duration.count() / 1000.0) / (1024 * 1024);
}
